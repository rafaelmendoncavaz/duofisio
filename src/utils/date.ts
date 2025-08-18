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
 * Converte uma data local para horário UTC.
 * @param datetime data em formato local.
 */
export function parseBrazilTimeToUTC(datetime: string): string {
    const utcDate = fromZonedTime(datetime, BRAZIL_TZ)

    return utcDate.toISOString()
}