import { useForm } from "react-hook-form"
import { DashboardTemplate } from "../../components/dashboard/dashboard-template"
import { Input } from "../../components/global/input"
import { useAPI } from "../../context/context"
import type { TypeAddress, TypeCep, TypeCreatePatient } from "../../types/types"
import { useEffect, useState } from "react"
import { viacep } from "../../api/api"

export function DashboardHome() {
    const [adultResponsible, setAdultResponsible] = useState<boolean>(false)
    const [adultCEP, setAdultCEP] = useState<string>("")
    const [adultAddress, setAdultAddress] = useState<TypeAddress | null>(null)
    const { getAddress, patientCEP, setCep, patientAddress } = useAPI(
        store => store
    )
    const { handleSubmit, register, setValue } = useForm<TypeCreatePatient>()

    async function getAdultAddress(cep: TypeCep) {
        try {
            const { data } = await viacep.get(`/${cep}/json`)
            setAdultAddress(data)
        } catch (error) {
            console.error("Erro ao buscar endereço do adulto", error)
        }
    }

    // biome-ignore lint/correctness/useExhaustiveDependencies: <Function re-renders>
    useEffect(() => {
        if (patientCEP && patientCEP.length === 8) {
            getAddress(patientCEP)
        }
        if (adultCEP && adultCEP.length === 8) {
            getAdultAddress(adultCEP)
        }
    }, [patientCEP, getAddress, adultCEP])

    function createPatient(data: TypeCreatePatient) {
        const patient = {
            name: data.name,
            cpf: data.cpf,
            dateOfBirth: data.dateOfBirth,
            phone: data.phone,
            email: data.email,
            sex: data.sex,
            profession: data.profession,
            address: {
                cep: data.address.cep,
                street: data.address.street,
                number: data.address.number,
                complement: data.address.complement,
                neighborhood: data.address.neighborhood,
                city: data.address.city,
                state: data.address.state,
            },
            clinicalData: {
                cid: data.clinicalData.cid,
                covenant: data.clinicalData.covenant,
                expires: data.clinicalData.expires,
                CNS: data.clinicalData.CNS,
                allegation: data.clinicalData.allegation,
                diagnosis: data.clinicalData.diagnosis,
            },
            adultResponsible: {
                name: data.adultResponsible?.name,
                cpf: data.adultResponsible?.cpf,
                phone: data.adultResponsible?.phone,
                email: data.adultResponsible?.email,
                address: {
                    cep: data.adultResponsible?.address.cep,
                    street: data.adultResponsible?.address.street,
                    number: data.adultResponsible?.address.number,
                    complement: data.adultResponsible?.address.complement,
                    neighborhood: data.adultResponsible?.address.neighborhood,
                    city: data.adultResponsible?.address.city,
                    state: data.adultResponsible?.address.state,
                },
            },
        }
        console.log(patient)
    }

    if (patientAddress) {
        setValue("address.street", patientAddress?.logradouro)
        setValue("address.neighborhood", patientAddress?.bairro)
        setValue("address.city", patientAddress?.localidade)
        setValue("address.state", patientAddress?.estado)
    }
    if (adultAddress) {
        setValue("adultResponsible.address.street", adultAddress?.logradouro)
        setValue("adultResponsible.address.neighborhood", adultAddress?.bairro)
        setValue("adultResponsible.address.city", adultAddress?.localidade)
        setValue("adultResponsible.address.state", adultAddress?.estado)
    }

    return (
        <DashboardTemplate>
            <h1>Seja bem vindo!</h1>
            <p>Há 9 atendimentos para serem realizados hoje!</p>

            <button type="button" onClick={() => getAddress("85803127")}>
                Teste getAddress
            </button>

            <form onSubmit={handleSubmit(createPatient)}>
                <div>
                    <div>
                        <h1>Dados Pessoais</h1>
                        <div className="w-full h-px bg-fisioblue shadow-shape" />
                        <div>
                            <label htmlFor="">Nome</label>
                            <Input type="text" {...register("name")} />
                        </div>
                        <div>
                            <label htmlFor="">CPF</label>
                            <Input type="text" {...register("cpf")} />
                        </div>
                        <div>
                            <label htmlFor="">Data de Nascimento</label>
                            <Input type="text" {...register("dateOfBirth")} />
                        </div>
                        <div>
                            <label htmlFor="">Telefone</label>
                            <Input type="text" {...register("phone")} />
                        </div>
                        <div>
                            <label htmlFor="">Email</label>
                            <Input type="text" {...register("email")} />
                        </div>
                        <div>
                            <label htmlFor="">Sexo</label>
                            <select {...register("sex")} defaultValue={""}>
                                <option value="" disabled>
                                    Selecione uma opção
                                </option>
                                <option value="Masculino">Masculino</option>
                                <option value="Feminino">Feminino</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="">Ocupação</label>
                            <Input type="text" {...register("profession")} />
                        </div>
                    </div>

                    <div>
                        <h1>Endereço</h1>
                        <div className="w-full h-px bg-fisioblue shadow-shape" />

                        <div>
                            <label htmlFor="">CEP</label>
                            <Input
                                type="text"
                                {...register("address.cep")}
                                onChange={e => setCep(e.target.value)}
                                value={patientCEP}
                            />
                        </div>
                        {patientAddress ? (
                            <>
                                <div>
                                    <label htmlFor="">Rua</label>
                                    <Input
                                        type="text"
                                        {...register("address.street")}
                                        value={patientAddress.logradouro}
                                        disabled
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Número</label>
                                    <Input
                                        type="text"
                                        {...register("address.number")}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Complemento</label>
                                    <Input
                                        type="text"
                                        {...register("address.complement")}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Bairro</label>
                                    <Input
                                        type="text"
                                        {...register("address.neighborhood")}
                                        value={patientAddress.bairro}
                                        disabled
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Cidade</label>
                                    <Input
                                        type="text"
                                        {...register("address.city")}
                                        value={patientAddress.localidade}
                                        disabled
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Estado</label>
                                    <Input
                                        type="text"
                                        {...register("address.state")}
                                        value={patientAddress.estado}
                                        disabled
                                    />
                                </div>
                            </>
                        ) : null}
                    </div>

                    <div>
                        <h1>Dados Clínicos</h1>
                        <div className="w-full h-px bg-fisioblue shadow-shape" />

                        <div>
                            <label htmlFor="">CID</label>
                            <Input
                                type="text"
                                {...register("clinicalData.cid")}
                            />
                        </div>
                        <div>
                            <label htmlFor="">Convênio</label>
                            <Input
                                type="text"
                                {...register("clinicalData.covenant")}
                            />
                        </div>
                        <div>
                            <label htmlFor="">Data de vencimento</label>
                            <Input
                                type="text"
                                {...register("clinicalData.expires")}
                            />
                        </div>
                        <div>
                            <label htmlFor="">CNS</label>
                            <Input
                                type="text"
                                {...register("clinicalData.CNS")}
                            />
                        </div>
                        <div>
                            <label htmlFor="">Reclamação do paciente</label>
                            <Input
                                type="text"
                                {...register("clinicalData.allegation")}
                            />
                        </div>
                        <div>
                            <label htmlFor="">Diagnóstico</label>
                            <Input
                                type="text"
                                {...register("clinicalData.diagnosis")}
                            />
                        </div>
                    </div>

                    <fieldset>
                        <legend>Possui adulto responsável?</legend>
                        <div>
                            <input
                                type="checkbox"
                                id="sim"
                                name="sim"
                                onChange={() =>
                                    setAdultResponsible(!adultResponsible)
                                }
                                checked={adultResponsible}
                            />
                            <label htmlFor="sim">Possui</label>
                        </div>
                    </fieldset>

                    {adultResponsible ? (
                        <>
                            <h1>Dados do Adulto</h1>
                            <div className="w-full h-px bg-fisioblue shadow-shape" />
                            <div>
                                <label htmlFor="">Nome</label>
                                <Input
                                    type="text"
                                    {...register("adultResponsible.name")}
                                />
                            </div>
                            <div>
                                <label htmlFor="">CPF</label>
                                <Input
                                    type="text"
                                    {...register("adultResponsible.cpf")}
                                />
                            </div>
                            <div>
                                <label htmlFor="">Telefone</label>
                                <Input
                                    type="text"
                                    {...register("adultResponsible.phone")}
                                />
                            </div>
                            <div>
                                <label htmlFor="">Email</label>
                                <Input
                                    type="text"
                                    {...register("adultResponsible.email")}
                                />
                            </div>

                            <div>
                                <h1>Endereço do Adulto</h1>
                                <div className="w-full h-px bg-fisioblue shadow-shape" />

                                <div>
                                    <label htmlFor="">CEP</label>
                                    <Input
                                        type="text"
                                        {...register(
                                            "adultResponsible.address.cep"
                                        )}
                                        onChange={e =>
                                            setAdultCEP(e.target.value)
                                        }
                                        value={adultCEP}
                                    />
                                </div>
                                {adultAddress ? (
                                    <>
                                        <div>
                                            <label htmlFor="">Rua</label>
                                            <Input
                                                type="text"
                                                {...register(
                                                    "adultResponsible.address.street"
                                                )}
                                                value={adultAddress?.logradouro}
                                                disabled
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="">Número</label>
                                            <Input
                                                type="text"
                                                {...register(
                                                    "adultResponsible.address.number"
                                                )}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="">
                                                Complemento
                                            </label>
                                            <Input
                                                type="text"
                                                {...register(
                                                    "adultResponsible.address.complement"
                                                )}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="">Bairro</label>
                                            <Input
                                                type="text"
                                                {...register(
                                                    "adultResponsible.address.neighborhood"
                                                )}
                                                value={adultAddress?.bairro}
                                                disabled
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="">Cidade</label>
                                            <Input
                                                type="text"
                                                {...register(
                                                    "adultResponsible.address.city"
                                                )}
                                                value={adultAddress?.localidade}
                                                disabled
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="">Estado</label>
                                            <Input
                                                type="text"
                                                {...register(
                                                    "adultResponsible.address.state"
                                                )}
                                                value={adultAddress?.estado}
                                                disabled
                                            />
                                        </div>
                                    </>
                                ) : null}
                            </div>
                        </>
                    ) : null}
                </div>
                <button type="submit">Cadastrar Paciente</button>
            </form>
        </DashboardTemplate>
    )
}
