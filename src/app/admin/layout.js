"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }) {
	const [adminAutenticado, setAdminAutenticado] = useState(false);
	const router = useRouter();

	useEffect(() => {
		// Verifica se existe adminId no localStorage
		const adminId = localStorage.getItem("adminId");
		// Se não existir e a rota não for a /admin (login), redireciona
		// (Opcional) ou você pode fazer essa verificação em cada página,
		// dependendo da sua lógica
		if (!adminId) {
			// IMPORTANTE: se o usuário estiver em /admin (que é o login),
			// não redirecionamos, senão ficaria em loop.
			// Então podemos checar a rota antes de redirecionar ou
			// delegar essa checagem para cada página.
		} else {
			setAdminAutenticado(true);
		}
	}, []);

	function handleLogout() {
		localStorage.removeItem("adminId");
		localStorage.removeItem("adminEmail");
		router.push("/admin"); // volta para a página de login
	}

	return (
		<div className="flex">
			{/* MENU LATERAL ou HEADER */}
			{adminAutenticado && (
				<nav className="w-1/8 bg-zinc-950 h-screen">
					<ul className="p-6">
						<li className="mb-4">
							<a href="/admin/home">Home</a>
						</li>
						<li className="mb-4">
							<a href="/admin/motoboys">Motoboys</a>
						</li>
						<li className="mb-4">
							<a href="/admin/entregas">Entregas</a>
						</li>
						<li>
							<button onClick={handleLogout}>Logout</button>
						</li>
					</ul>
				</nav>
			)}

			{/* CONTEÚDO PRINCIPAL */}
			<main className="flex-1 p-4">{children}</main>
		</div>
	);
}
