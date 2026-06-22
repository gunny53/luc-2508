import z from 'zod'

/**
 * https://docs.sepay.vn/tich-hop-webhooks.html
 */
export const WebhookPaymentBodySchema = z.object({
  id: z.number().transform((val) => val.toString()),
  gateway: z.string(),
  transactionDate: z.string(),
  accountNumber: z.string().nullable(),
  code: z.string().nullable(),
  content: z.string().nullable(),
  transferType: z.enum(['in', 'out']),
  transferAmount: z.number(),
  accumulated: z.number(),
  subAccount: z.string().nullable(),
  referenceCode: z.string().nullable(),
  description: z.string()
})

export type WebhookPaymentBodyType = z.infer<typeof WebhookPaymentBodySchema>
