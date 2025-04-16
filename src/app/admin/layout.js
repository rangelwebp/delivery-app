"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
	const [adminAutenticado, setAdminAutenticado] = useState(false);
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		const adminId = localStorage.getItem("adminId");
		if (adminId) {
			setAdminAutenticado(true);
		} else {
			setAdminAutenticado(false);
		}
	}, [pathname]);
	// a cada mudança de rota, rechecamos o localStorage

	function handleLogout() {
		localStorage.removeItem("adminId");
		localStorage.removeItem("adminEmail");

		// FORÇA O ESTADO PARA FALSE
		setAdminAutenticado(false);

		router.push("/admin"); // volta para a página de login
	}

	if (pathname === "/admin") {
		return <>{children}</>;
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
