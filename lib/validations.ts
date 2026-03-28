import { z } from 'zod'
import { MIN_STAKE, MAX_STAKE } from './constants'

export const stakeSchema = (balance: number) =>
  z.object({
    stake: z
      .number({ invalid_type_error: 'Geçerli bir miktar girin' })
      .min(MIN_STAKE, `Minimum: ${MIN_STAKE}₺`)
      .max(MAX_STAKE, `Maximum: ${MAX_STAKE}₺`)
      .refine((val) => val <= balance, 'Yetersiz bakiye'),
  })

export const responsibleGamblingSchema = z.object({
  deposit_limit: z.number().positive().nullable(),
  loss_limit: z.number().positive().nullable(),
  time_out_until: z.string().datetime().nullable(),
})

export const depositSchema = z.object({
  amount: z
    .number()
    .min(50, 'Minimum para yatırma: 50₺')
    .max(50000, 'Maximum para yatırma: 50.000₺'),
})

export const withdrawalSchema = z.object({
  amount: z
    .number()
    .min(50, 'Minimum çekim: 50₺')
    .max(50000),
})
