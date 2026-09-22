<div class="kicker">The artifact names its own vulnerability</div>

# `chain_type="stuff"`

<div class="small muted mb-2">From this repo — <code>src/rag_system.py</code></div>

```python {all|3-5|6}
self.qa_chain = RetrievalQA.from_chain_type(
    llm=self.llm,
    chain_type="stuff",          # ← literally: stuff every retrieved chunk into the prompt
    retriever=self.vectorstore.as_retriever(
        search_type="similarity", search_kwargs={"k": 4}),
    return_source_documents=True,
)
```

<div v-click class="mt-6 card card-deep">
"Stuff" is the default RAG chain. It concatenates the top-k chunks straight into the prompt template — no provenance, no trust tier, no boundary. The most common RAG pattern in production <strong>is</strong> the vulnerable one.
</div>
