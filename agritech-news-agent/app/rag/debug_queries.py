#!/usr/bin/env python3
"""
RAG Query Debugging Script
Shows how the system finds the relevant context for each question
"""

from qdrant_client import QdrantClient
from app.rag.modules.embeddings import embed_texts
from app.rag.modules.generator import generate_response
import json

def debug_query(question: str, show_full_context: bool = False):
    """
    Debug a query by showing the search and retrieval process
    """
    print("🔍 RAG QUERY DEBUGGING")
    print("=" * 50)
    print(f"❓ Question: {question}")
    print()
    
    # 1. Connexion à Qdrant
    client = QdrantClient(host="localhost", port=6333)
    
    # 2. Generate the question embedding
    print("🧠 STEP 1: Generate the question embedding")
    print("-" * 40)
    
    try:
        question_embedding = embed_texts([question])[0]
        print(f"✅ Embedding generated: {len(question_embedding)} dimensions")
        print(f"📊 First values: {question_embedding[:5]}...")
    except Exception as e:
        print(f"❌ Error generating the embedding: {e}")
        return
    
    # 3. Search for the most similar chunks
    print(f"\n🔍 STEP 2: Search for relevant chunks")
    print("-" * 40)
    
    try:
        search_results = client.search(
            collection_name="rag_collection",
            query_vector=question_embedding,
            limit=5,  # Retrieve top-5 for analysis
            with_payload=True,
            with_vectors=False
        )
        
        print(f"📊 Found chunks: {len(search_results)}")
        print()
        
        # Analyze each result
        relevant_chunks = []
        for i, result in enumerate(search_results):
            score = result.score
            chunk_text = result.payload.get('text', 'No text')
            chunk_id = result.id
            
            print(f"🏆 CHUNK #{i+1} (ID: {chunk_id})")
            print(f"   📈 Similarity score: {score:.4f}")
            print(f"   📏 Length: {len(chunk_text)} characters")
            
            # Analyze the relevance of the chunk
            relevance_analysis = analyze_chunk_relevance(question, chunk_text)
            print(f"   🎯 Relevance: {relevance_analysis}")
            
            # Show a preview of the chunk
            preview = chunk_text[:150] + "..." if len(chunk_text) > 150 else chunk_text
            print(f"   📝 Preview: {preview}")
            
            # Decide if the chunk is sufficiently relevant
            if score > 0.3:  # Relevance threshold
                relevant_chunks.append(chunk_text)
                print(f"   ✅ CONSERVED (score > 0.3)")
            else:
                print(f"   ⚠️  SCORE TOO LOW")
            
            print()
        
        # 4. Construct the final context
        print("📋 STEP 3: Construct the final context")
        print("-" * 40)
        
        if relevant_chunks:
            context = "\n\n".join(relevant_chunks)
            print(f"✅ Context constructed: {len(relevant_chunks)} relevant chunks")
            print(f"📏 Total context length: {len(context)} characters")
            
            if show_full_context:
                print(f"\n📄 FULL CONTEXT:")
                print("─" * 50)
                print(context)
                print("─" * 50)
            
            # 5. Generate the answer
            print(f"\n🤖 STEP 4: Generate the answer")
            print("-" * 40)
            
            try:
                answer = generate_response(relevant_chunks, question)
                print(f"✅ Answer generated:")
                print("─" * 50)
                print(answer)
                print("─" * 50)
                
            except Exception as e:
                print(f"❌ Error generating the answer: {e}")
                
        else:
            print("❌ No relevant chunk found")
            print("💡 Suggestions:")
            print("   • Reformulate your question")
            print("   • Use keywords from the document")
            print("   • Check that the document contains the information")
    
    except Exception as e:
        print(f"❌ Error during the search: {e}")


def analyze_chunk_relevance(question: str, chunk_text: str) -> str:
    """
    Analyze the relevance of a chunk with respect to a question
    """
    question_lower = question.lower()
    chunk_lower = chunk_text.lower()
    
    # Count the common keywords
    question_words = set(question_lower.split())
    chunk_words = set(chunk_lower.split())
    common_words = question_words.intersection(chunk_words)
    
    # Filter out too short words
    common_words = {w for w in common_words if len(w) > 3}
    
    if len(common_words) >= 3:
        return f"VERY RELEVANT ({len(common_words)} keywords: {', '.join(list(common_words)[:3])})"
    elif len(common_words) >= 1:
        return f"RELEVANT ({len(common_words)} keywords: {', '.join(common_words)})"
    else:
        return "NOT RELEVANT (no common keywords)"


def interactive_debug():
    """
    Interactive mode to test multiple questions
    """
    print("🔍 INTERACTIVE DEBUG MODE")
    print("=" * 40)
    print("Type your questions to analyze the RAG process")
    print("Commands: 'quit' to exit, 'context' to see the full context")
    print()
    
    while True:
        try:
            question = input("❓ Your question: ").strip()
            
            if not question:
                continue
                
            if question.lower() in ['quit', 'exit', 'q']:
                break
                
            if question.lower() == 'context':
                # Full context mode
                debug_query("humanitarian data", show_full_context=True)
                continue
            
            # Normal mode
            debug_query(question, show_full_context=False)
            
            print("\n" + "="*60 + "\n")
            
        except KeyboardInterrupt:
            break
        except Exception as e:
            print(f"❌ Error: {e}")


if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        # Command line mode
        question = " ".join(sys.argv[1:])
        debug_query(question, show_full_context=True)
    else:
        # Interactive mode
        interactive_debug()
