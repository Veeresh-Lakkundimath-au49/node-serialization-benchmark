# Node.js Serialization Benchmark: JSON vs. Multipart

A high-concurrency performance study on the memory overhead and CPU efficiency of different serialization formats in the V8 engine.

## 📊 The Findings (at 1,000-op scale)

| Metric | JSON (Template Literal) | Multipart (Detailed) | Delta |
| :--- | :--- | :--- | :--- |
| **Payload Size** | 0.45 KB | 0.53 KB | +18% |
| **CPU Time** | 0.0003 ms | 0.0005 ms | +66% |
| **RAM Spike** | **0.22 KB** | **9.77 KB** | **44x Heavier** |

## 🚀 Key Takeaways
- **The "Serialization Tax":** Using Multipart for text-only data creates a 44x heavier heap footprint.
- **P99 Stability:** High memory churn triggers frequent "Stop-the-World" Garbage Collection pauses, which can destroy P99 latency in production.
- **Serverless Impact:** In environments like AWS Lambda, this overhead forces over-provisioning of memory, directly increasing cloud costs.

## 🛠️ How to Run
1. Clone the repo.
2. Run `npm install`.
3. Run `node index.js`.
