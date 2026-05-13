const { performance } = require('perf_hooks');

const BATCH_SIZE = 50; // Measuring 50 ops at once for stability

function measureDeep(name, task) {
    // 1. Setup a "heavy" base 
    const heavyString = "X".repeat(400);

    // 2. Initial GC Clear (if run with --expose-gc)
    if (global.gc) global.gc();

    const startMem = process.memoryUsage().heapUsed;
    const startTime = performance.now();

    // 3. Execute the batch
    const batchResults = [];
    for (let i = 0; i < BATCH_SIZE; i++) {
        batchResults.push(task(i, heavyString));
    }

    const endTime = performance.now();
    const endMem = process.memoryUsage().heapUsed;

    const sampleSize = Buffer.byteLength(batchResults[0]);
    const totalCpu = endTime - startTime;

    console.log(`=== ${name} ===`);
    console.log(`Payload Size: ${(sampleSize / 1024).toFixed(2)} KB`);
    console.log(`RAM Spike (per op): ${((endMem - startMem) / BATCH_SIZE / 1024).toFixed(2)} KB`);
    console.log(`CPU Time (per op): ${(totalCpu / BATCH_SIZE).toFixed(4)} ms\n`);
}

// --- JSON-STRING (Template Literal) ---
measureDeep("JSON-String (Template Literal)", (i, extra) => {
    // Manually creating the JSON structure as a string
    return `{"id":${i},"user":"India","data":"${extra}","meta":"scale_test"}`;
});

// --- DYNAMIC MULTIPART ---
measureDeep("Multipart (Detailed)", (i, extra) => {
    // Adding the 'user' and 'meta' fields to match the JSON payload exactly
    return `------Boundary\r\nContent-Disposition: form-data; name="id"\r\n\r\n${i}\r\n` +
           `------Boundary\r\nContent-Disposition: form-data; name="user"\r\n\r\nIndia\r\n` +
           `------Boundary\r\nContent-Disposition: form-data; name="data"\r\n\r\n${extra}\r\n` +
           `------Boundary\r\nContent-Disposition: form-data; name="meta"\r\n\r\nscale_test\r\n` +
           `------Boundary--`;
});