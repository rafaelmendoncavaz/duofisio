import { parse, set } from "date-fns"
import { toZonedTime, fromZonedTime , format } from "date-fns-tz"

const BRAZIL_TZ: string = "America/Sao_Paulo"

/**
 * Converte uma data UTC para horário de Brasília e formata para exibição.
 * @param date ISO string ou Date em UTC
 * @param dateFormat Formato desejado, padrão 'dd/MM/yyyy HH:mm'
 */
export function formatToBrazilTime(date: string | Date, dateFormat = 'dd/MM/yyyy HH:mm'): string {
    const utcDate = typeof date === "string" ? new Date(date) : date
    const zonedDate = toZonedTime(utcDate, BRAZIL_TZ)
    return format(zonedDate, dateFormat, {
        timeZone: BRAZIL_TZ
    })
}

/**
 * Converte uma data UTC para o formato aceito pelo input datetime-local
 * Exemplo: "2025-08-22T20:00"
 */
export function toDatetimeLocalValue(date: string | Date): string {
    const utcDate = typeof date === "string" ? new Date(date) : date
    const zonedDate = toZonedTime(utcDate, BRAZIL_TZ)
    return format(zonedDate, "yyyy-MM-dd'T'HH:mm", { timeZone: BRAZIL_TZ })
}

/**
 * Converte uma data local para horário UTC.
 * @param datetime data em formato local.
 */
export function parseBrazilTimeToUTC(datetime: string): string {
    const utcDate = fromZonedTime(datetime, BRAZIL_TZ)

    return utcDate.toISOString()
}

/**
 * Converte um valor date-only ('yyyy-MM-dd' ou Date) para um instante UTC.
 * mode = 'start' -> meia-noite do dia em America/Sao_Paulo convertida para UTC
 * mode = 'end'   -> 23:59:59.999 do dia em America/Sao_Paulo convertida para UTC
 *
 * Retorna Date (UTC instant) — lança se value for um formato claramente inválido.
 *
 * MUDANÇA >> usado somente pelo filtro history para interpretar "date-only" como dia em SP.
 */
export function dateOnlyToUTC(value: string | Date, mode: "start" | "end"): Date {
  let localDate =
    typeof value === "string" ? parse(value, "yyyy-MM-dd", new Date()) : value;

  if (!(localDate instanceof Date) || Number.isNaN(localDate.getTime())) {
    throw new Error(`dateOnlyToUTC: invalid date-only value: ${String(value)}`);
  }


  if (mode === "start") {
    const startLocal = set(localDate, {
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });
    localDate = startLocal;
  }
  if (mode === "end") {
    const endLocal = set(localDate, {
      hours: 23,
      minutes: 59,
      seconds: 59,
      milliseconds: 999,
    });
    localDate = endLocal;
  }

  return fromZonedTime(localDate, BRAZIL_TZ);
}