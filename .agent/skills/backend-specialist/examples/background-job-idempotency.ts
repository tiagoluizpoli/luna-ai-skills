/**
 * IDEMPOTENCY & BACKGROUND JOB SAFETY
 * 
 * Demonstrates:
 * 1. Safe retries for non-idempotent operations.
 * 2. State-aware processing.
 * 3. Lock/lease pattern for concurrency.
 */

import { ID, Databases } from 'node-appwrite';

/**
 * Scenario: Processing a payment.
 * We must ensure we don't charge the user twice even if the network fails.
 */
export async function processPayment(
  idempotencyKey: string,
  userId: string,
  amount: number,
  databases: Databases
) {
  const DB_ID = 'main';
  const JOBS_COLLECTION = 'jobs';

  // 1. ATOMIC CHECK-AND-CREATE (The idempotency lock)
  try {
    const job = await databases.createDocument(
      DB_ID,
      JOBS_COLLECTION,
      idempotencyKey, // Using the key as the Document ID ensures uniqueness at the DB level
      {
        userId,
        amount,
        status: 'pending',
        type: 'payment',
        createdAt: new Date().toISOString(),
      }
    );
    console.log(`[Job] Created new job for key ${idempotencyKey}`);
  } catch (error: any) {
    if (error.code === 409) {
      // Conflict: The key has already been used.
      // Retrieve the existing job to see if it's finished.
      const existingJob = await databases.getDocument(DB_ID, JOBS_COLLECTION, idempotencyKey);
      
      if (existingJob.status === 'completed') {
        return { success: true, message: 'Payment already processed previously.', data: existingJob.result };
      }
      
      if (existingJob.status === 'processing') {
        throw new Error('Payment is still being processed by another worker.');
      }
      
      // If it's still 'pending' or 'failed', we can retry.
      console.log(`[Job] Retrying existing job for key ${idempotencyKey}`);
    } else {
      throw error;
    }
  }

  // 2. MARK AS PROCESSING
  await databases.updateDocument(DB_ID, JOBS_COLLECTION, idempotencyKey, {
    status: 'processing',
    startedAt: new Date().toISOString(),
  });

  // 3. EXECUTE THE ACTUAL OPERATION
  try {
    const paymentResult = await externalPaymentGateway.charge(userId, amount);
    
    // 4. MARK AS COMPLETED WITH RESULT
    const finalJob = await databases.updateDocument(DB_ID, JOBS_COLLECTION, idempotencyKey, {
      status: 'completed',
      result: paymentResult,
      finishedAt: new Date().toISOString(),
    });

    return { success: true, data: paymentResult };
  } catch (error: any) {
    // 5. HANDLE FAILURE
    console.error(`[Job] Payment failed for key ${idempotencyKey}`, error);
    
    await databases.updateDocument(DB_ID, JOBS_COLLECTION, idempotencyKey, {
      status: 'failed',
      error: error.message,
    });

    throw new Error('Payment processing failed. Please try again.');
  }
}

// Mock external service
const externalPaymentGateway = {
  charge: async (userId: string, amount: number) => {
    return { transactionId: 'txn_' + ID.unique(), amount, userId };
  }
};
