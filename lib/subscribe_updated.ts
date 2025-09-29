
"use server";

import { Redis } from "@upstash/redis"
import { TABLES } from "./constants";
import { ActionResult, error, success } from "./utils";
import { newsletterSchema } from "./schema";

// Definindo a variável de ambiente para testar a configuração
const IS_DEMO = !process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN;

// Criando o cliente Redis utilizando as variáveis de ambiente do Upstash
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

// Função para salvar alterações automaticamente no Redis
export const saveChangesAutomatically = async (key: string, value: any): Promise<ActionResult<string>> => {
  try {
    // Enviar a alteração diretamente para o Redis
    await redis.set(key, JSON.stringify(value));

    return success("Alteração salva com sucesso no Redis!");
  } catch (error) {
    return error("Erro ao salvar alteração no Redis.");
  }
};

// Função de inscrição de newsletter
export const subscribe = async (email: string): Promise<ActionResult<string>> => {
  if (IS_DEMO) {
    return error("Missing required setup");
  }

  const parsed = newsletterSchema.safeParse({ email });

  if (!parsed.success) {
    return error(parsed.error.message);
  }

  try {
    const emailList = await redis.get<string[]>(TABLES.EMAIL_LIST);

    if (emailList && emailList.includes(parsed.data.email)) {
      return success("Email is already subscribed");
    }

    if (emailList) {
      await redis.set(TABLES.EMAIL_LIST, [...emailList, parsed.data.email]);
    } else {
      await redis.set(TABLES.EMAIL_LIST, [parsed.data.email]);
    }

    // Salvar a alteração no Redis automaticamente
    await saveChangesAutomatically(TABLES.EMAIL_LIST, emailList);

    return success("Email successfully subscribed");
  } catch (error) {
    return error("Erro ao processar a inscrição");
  }
};
