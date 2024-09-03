import type { Patient } from "../types/types";

export const patientData: Patient[] = [
  {
    id: crypto.randomUUID(),
    name: "João Silva",
    cpf: "123.456.789-00",
    rg: "MG-12.345.678",
    dob: "1985-07-15",
    phone: "31987654321",
    email: "joao.silva@example.com",
    sex: "Masculino",
    profession: "Engineer",
    address: {
      id: crypto.randomUUID(),
      cep: "30130-010",
      street: "Rua Afonso Pena",
      number: 123,
      complement: "Apt 301",
      neighborhood: "Centro",
      city: "Belo Horizonte",
      state: "MG"
    },
    clinicalData: {
      id: crypto.randomUUID(),
      cid: "J30.1",
      covenant: "HealthCare Plus",
      expires: "2024-12-31",
      CNS: 12345678901,
      allegation: "Chronic Rhinitis",
      diagnosis: "Seasonal Allergies"
    }
  },
  {
    id: crypto.randomUUID(),
    name: "Maria Fernandes",
    cpf: "987.654.321-11",
    rg: "SP-45.678.910",
    dob: "1990-02-25",
    phone: "11987654322",
    email: "maria.fernandes@example.com",
    sex: "Feminino",
    profession: "Teacher",
    address: {
      id: crypto.randomUUID(),
      cep: "01310-000",
      street: "Av. Paulista",
      number: 456,
      complement: "Suite 45",
      neighborhood: "Bela Vista",
      city: "São Paulo",
      state: "SP"
    },
    clinicalData: {
      id: crypto.randomUUID(),
      cid: "E66.9",
      covenant: "HealthSafe",
      expires: "2025-06-15",
      CNS: 23456789012,
      allegation: "Weight Management",
      diagnosis: "Obesity"
    },
    adultResponsible: {
      id: crypto.randomUUID(),
      name: "José Fernandes",
      cpf: "102.345.678-90",
      rg: "SP-12.345.678",
      phone: "11987654333",
      email: "jose.fernandes@example.com",
      address: {
        id: crypto.randomUUID(),
        cep: "01310-000",
        street: "Av. Paulista",
        number: 456,
        complement: "Suite 45",
        neighborhood: "Bela Vista",
        city: "São Paulo",
        state: "SP"
      }
    }
  },
  {
    id: crypto.randomUUID(),
    name: "Carlos Souza",
    cpf: "741.852.963-88",
    rg: "RJ-78.910.112",
    dob: "1978-11-10",
    phone: "21987654323",
    email: "carlos.souza@example.com",
    sex: "Masculino",
    profession: "Lawyer",
    address: {
      id: crypto.randomUUID(),
      cep: "22290-240",
      street: "Rua Jardim Botânico",
      number: 789,
      complement: "Casa",
      neighborhood: "Jardim Botânico",
      city: "Rio de Janeiro",
      state: "RJ"
    },
    clinicalData: {
      id: crypto.randomUUID(),
      cid: "K21.0",
      covenant: "Global Health",
      expires: "2026-08-20",
      CNS: 34567890123,
      allegation: "Gastroesophageal Reflux",
      diagnosis: "GERD"
    }
  },
  {
    id: crypto.randomUUID(),
    name: "Ana Pereira",
    cpf: "159.753.486-77",
    rg: "BA-34.567.890",
    dob: "1989-03-12",
    phone: "71987654324",
    email: "ana.pereira@example.com",
    sex: "Feminino",
    profession: "Nurse",
    address: {
      id: crypto.randomUUID(),
      cep: "40060-001",
      street: "Av. Sete de Setembro",
      number: 234,
      complement: "Bloco B",
      neighborhood: "Campo Grande",
      city: "Salvador",
      state: "BA"
    },
    clinicalData: {
      id: crypto.randomUUID(),
      cid: "F32.1",
      covenant: "LifeCare",
      expires: "2024-10-05",
      CNS: 45678901234,
      allegation: "Depression",
      diagnosis: "Moderate Depressive Episode"
    }
  },
  {
    id: crypto.randomUUID(),
    name: "Roberto Lima",
    cpf: "321.654.987-22",
    rg: "PR-56.789.123",
    dob: "1995-06-18",
    phone: "41987654325",
    email: "roberto.lima@example.com",
    sex: "Masculino",
    profession: "Architect",
    address: {
      id: crypto.randomUUID(),
      cep: "80030-230",
      street: "Rua XV de Novembro",
      number: 567,
      complement: "Apt 403",
      neighborhood: "Centro",
      city: "Curitiba",
      state: "PR"
    },
    clinicalData: {
      id: crypto.randomUUID(),
      cid: "I10",
      covenant: "Secure Health",
      expires: "2025-02-28",
      CNS: 56789012345,
      allegation: "Hypertension",
      diagnosis: "Essential Hypertension"
    }
  },
  {
    id: crypto.randomUUID(),
    name: "Fernanda Costa",
    cpf: "654.321.987-33",
    rg: "SC-78.910.234",
    dob: "2000-12-08",
    phone: "48987654326",
    email: "fernanda.costa@example.com",
    sex: "Feminino",
    profession: "Designer",
    address: {
      id: crypto.randomUUID(),
      cep: "88020-100",
      street: "Rua Felipe Schmidt",
      number: 89,
      complement: "Sala 12",
      neighborhood: "Centro",
      city: "Florianópolis",
      state: "SC"
    },
    clinicalData: {
      id: crypto.randomUUID(),
      cid: "E10",
      covenant: "Health Cover",
      expires: "2026-05-14",
      CNS: 67890123456,
      allegation: "Type 1 Diabetes",
      diagnosis: "Diabetes Mellitus Type 1"
    }
  },
  {
    id: crypto.randomUUID(),
    name: "Lucas Oliveira",
    cpf: "987.123.654-44",
    rg: "RS-89.012.345",
    dob: "1987-04-25",
    phone: "51987654327",
    email: "lucas.oliveira@example.com",
    sex: "Masculino",
    profession: "Chef",
    address: {
      id: crypto.randomUUID(),
      cep: "90010-150",
      street: "Av. Borges de Medeiros",
      number: 101,
      complement: "Loja 7",
      neighborhood: "Centro Histórico",
      city: "Porto Alegre",
      state: "RS"
    },
    clinicalData: {
      id: crypto.randomUUID(),
      cid: "N18.5",
      covenant: "Complete Care",
      expires: "2025-11-12",
      CNS: 78901234567,
      allegation: "Chronic Kidney Disease",
      diagnosis: "CKD Stage 5"
    }
  },
  {
    id: crypto.randomUUID(),
    name: "Julia Ribeiro",
    cpf: "321.987.654-55",
    rg: "PE-45.678.910",
    dob: "1992-09-30",
    phone: "81987654328",
    email: "julia.ribeiro@example.com",
    sex: "Feminino",
    profession: "Pharmacist",
    address: {
      id: crypto.randomUUID(),
      cep: "50020-100",
      street: "Rua da Aurora",
      number: 55,
      complement: "Casa",
      neighborhood: "Boa Vista",
      city: "Recife",
      state: "PE"
    },
    clinicalData: {
      id: crypto.randomUUID(),
      cid: "M54.5",
      covenant: "Wellness Plan",
      expires: "2026-03-22",
      CNS: 89012345678,
      allegation: "Low Back Pain",
      diagnosis: "Lumbago"
    }
  },
  {
    id: crypto.randomUUID(),
    name: "Marcos Santos",
    cpf: "456.789.123-66",
    rg: "GO-34.567.890",
    dob: "1982-05-17",
    phone: "62987654329",
    email: "marcos.santos@example.com",
    sex: "Masculino",
    profession: "Pilot",
    address: {
      id: crypto.randomUUID(),
      cep: "74030-070",
      street: "Rua 24 de Outubro",
      number: 76,
      complement: "Apt 2",
      neighborhood: "Setor Central",
      city: "Goiânia",
      state: "GO"
    },
    clinicalData: {
      id: crypto.randomUUID(),
      cid: "H52.4",
      covenant: "OptiHealth",
      expires: "2024-09-01",
      CNS: 90123456789,
      allegation: "Presbyopia",
      diagnosis: "Age-related Vision Changes"
    }
  },
  {
    id: crypto.randomUUID(),
    name: "Paula Rocha",
    cpf: "789.123.456-77",
    rg: "CE-12.345.678",
    dob: "1975-01-20",
    phone: "85987654330",
    email: "paula.rocha@example.com",
    sex: "Feminino",
    profession: "Psychologist",
    address: {
      id: crypto.randomUUID(),
      cep: "60170-010",
      street: "Av. Beira Mar",
      number: 432,
      complement: "Cobertura",
      neighborhood: "Meireles",
      city: "Fortaleza",
      state: "CE"
    },
    clinicalData: {
      id: crypto.randomUUID(),
      cid: "F41.0",
      covenant: "Mental Health Care",
      expires: "2024-11-30",
      CNS: 12345678901,
      allegation: "Generalized Anxiety",
      diagnosis: "Anxiety Disorder"
    }
  }
]