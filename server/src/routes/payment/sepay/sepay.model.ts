import z from 'zod'

/**
 * https://docs.sepay.vn/tich-hop-webhooks.html
 */
export const WebhookPaymentBodySchema = z.object({
  id: z.number().transform((val) => val.toString()), // English content normalized from the original source text.
  gateway: z.string(), // English content normalized from the original source text.
  transactionDate: z.string(), // English content normalized from the original source text.
  accountNumber: z.string().nullable(), // English content normalized from the original source text.
  code: z.string().nullable(), // English content normalized from the original source text.
  content: z.string().nullable(), // English content normalized from the original source text.
  transferType: z.enum(['in', 'out']), // English content normalized from the original source text.
  transferAmount: z.number(), // English content normalized from the original source text.
  accumulated: z.number(), // English content normalized from the original source text.
  subAccount: z.string().nullable(), // English content normalized from the original source text.
  referenceCode: z.string().nullable(), // English content normalized from the original source text.
  description: z.string() // English content normalized from the original source text.
})

export type WebhookPaymentBodyType = z.infer<typeof WebhookPaymentBodySchema>
