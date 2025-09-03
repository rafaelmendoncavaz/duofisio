import type { TypeEmployee } from "../../types/types"
import { Calendar, Settings, UserRoundX } from "lucide-react"
import { formatToBrazilTime } from "../../utils/date"
import { useAPI, useModal } from "../../store/store"
import { UpdateEmployeeModal } from "../modal/employee/update-employee-modal"
import { CreateEmployeeModal } from "../modal/employee/create-employee-modal"

interface DashboardManageProps {
  employees: TypeEmployee[] | null
  setToggleManage: (toggleManage: boolean) => void
}

export function DashboardManage({ employees, setToggleManage }: DashboardManageProps) {
    const { verifyAuth, getEmployee, deleteEmployee } = useAPI();
    const { 
        isCreateEmployeeModalOpen,
        isUpdateEmployeeModalOpen, 
        openUpdateEmployeeModal 
    } = useModal();

    const handleUpdateEmployee = async (id: string) => {
        const { success } = await getEmployee(id);

        if (success) {
            openUpdateEmployeeModal()
        }
    }

    const handleDeleteEmployee = async (id: string) => {
        const confirmation = window.confirm("Você está prestes a deletar um usuário.\nEsta ação não pode ser desfeita!");

        if (confirmation) {
            const result = await deleteEmployee(id);

            if (result.success) {
                setToggleManage(false);
                await verifyAuth();
            }
        }
    }
    
  return (
    <div className="w-full flex flex-col gap-4">
      {
        employees
            ? (
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                    <table className="min-w-full border-collapse bg-white text-sm text-left">
                        <thead className="bg-fisioblue text-white text-sm">
                            <tr>
                            <th className="px-4 py-3">Nome</th>
                            <th className="px-4 py-3">E-mail</th>
                            <th className="px-4 py-3">Privilégios</th>
                            <th className="px-4 py-3 flex items-center gap-1"><Calendar size={16}/>Criado em</th>
                            <th className="px-4 py-3">Atualizado em</th>
                            <th className="px-4 py-3">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.slice()
                                .sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                                .map((employee) => (
                            <tr
                                key={employee.id}
                                className="border-t border-gray-200 hover:bg-gray-50 transition"
                            >
                                <td className="px-4 py-3 truncate" title={employee.name}>{employee.name}</td>
                                <td className="px-4 py-3">{employee.email}</td>
                                <td className="px-4 py-3">{employee.isAdmin ? "Sim" : "Não"}</td>
                                <td className="px-4 py-3">
                                {formatToBrazilTime(employee.createdAt, "dd/MM/yyyy HH:mm")}
                                </td>
                                <td className="px-4 py-3">
                                {formatToBrazilTime(employee.updatedAt, "dd/MM/yyyy HH:mm")}
                                </td>
                                <td className="px-4 py-3 flex gap-2">
                                    <button
                                        type="button"
                                        title="Editar Usuário"
                                        onClick={() => handleUpdateEmployee(employee.id)}
                                        className="px-2 py-1  text-fisiogray bg-fisiolightgray/20 rounded"
                                    >
                                        <Settings size={18} />
                                    </button>
                                    <button
                                        type="button"
                                        title="Excluir usuário"
                                        onClick={() => handleDeleteEmployee(employee.id)}
                                        className="px-2 py-1 bg-red-700 text-white rounded"
                                        >
                                        <UserRoundX size={18} />
                                    </button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                    {isUpdateEmployeeModalOpen && <UpdateEmployeeModal />}
                    {isCreateEmployeeModalOpen && <CreateEmployeeModal />}
                </div>
            )
            : (
                <p>
                    Nenhum usuário encontrado.
                </p>
            )
      }
    </div>
  )
}
