import type { z } from "zod";
import type { loginSchema } from "../schema/schema";

export type LoginData = z.infer<typeof loginSchema>

export interface Address {
  id: string,
  cep: string,
  street: string,
  number: number,
  complement: string,
  neighborhood: string,
  city: string,
  state: string,
}

export interface ClinicalData {
  id: string,
  cid: string,
  covenant: string,
  expires: string,
  CNS: number,
  allegation: string,
  diagnosis: string
}

export interface AdultResponsible {
  id: string,
  name: string,
  cpf: string,
  rg: string,
  phone: string,
  email: string,
  address: Address
}

export interface Patient {
  id: string,
  name: string,
  cpf: string,
  rg: string,
  dob: string,
  phone: string,
  email: string,
  sex: "Masculino" | "Feminino",
  profession: string,
  address: Address,
  clinicalData: ClinicalData,
  adultResponsible?: AdultResponsible
}