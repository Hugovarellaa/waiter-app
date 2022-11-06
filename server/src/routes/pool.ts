import { FastifyInstance } from 'fastify'
import ShortUniqueId from 'short-unique-id'
import { z } from 'zod'

import { prisma } from '../lib/prisma'
import { authenticate } from '../plugins/authenticate'

export async function poolRoutes(fastify: FastifyInstance) {
  fastify.get('/pools/count', async () => {
    const count = await prisma.pool.count()
    return { count }
  })

  fastify.post('/pools', async (request, reply) => {
    const createPollBody = z.object({
      title: z.string(),
    })

    const { title } = createPollBody.parse(request.body)

    const generate = new ShortUniqueId({ length: 6 })
    const code = String(generate()).toUpperCase()

    try {
      // tenho um usuário autenticado
      await request.jwtVerify()
      await prisma.pool.create({
        data: {
          title,
          code,
          ownerId: request.user.sub,

          participants: {
            create: {
              userId: request.user.sub,
            },
          },
        },
      })
    } catch {
      // nao tenho um usuário autenticado ai eu crio
      await prisma.pool.create({
        data: {
          title,
          code,
        },
      })
    }

    return reply.status(201).send({ title, code })
  })

  fastify.post(
    '/pools/:id/join',
    {
      onRequest: [authenticate],
    },
    async (request, reply) => {
      const joinPoolBody = z.object({
        code: z.string(),
      })

      const { code } = joinPoolBody.parse(request.body)

      const pool = await prisma.pool.findUnique({
        where: {
          code,
        },
        include: {
          participants: {
            where: {
              userId: request.user.sub,
            },
          },
        },
      })

      if (!pool) {
        return reply.status(400).send({ message: 'Pool not found' })
      }

      if (pool.participants.length > 0) {
        return reply.status(400).send({ message: 'Pool not found' })
      }

      if (!pool.ownerId) {
        await prisma.pool.update({
          where: {
            id: pool.id,
          },
          data: {
            ownerId: request.user.sub,
          },
        })
      }

      await prisma.participant.create({
        data: {
          poolId: pool.id,
          userId: request.user.sub,
        },
      })

      return reply.status(201).send()
    },
  )
}
