"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminHomePage() {
	const router = useRouter();
	const [adminAutenticado, setAdminAutenticado] = useState(false);

	useEffect(() => {
		// Verificar se existe um "adminId" no localStorage
		const adminId = localStorage.getItem("adminId");
		if (!adminId) {
			// Se não estiver logado, redireciona para /admin (login)
			router.push("/admin");
		} else {
			setAdminAutenticado(true);
		}
	}, []);

	// Se não estiver autenticado, podemos retornar um "loading" ou algo assim
	if (!adminAutenticado) {
		return <p>Verificando credenciais...</p>;
	}

	return (
		<main style={{ margin: "20px" }}>
			<h1>Dashboard do Admin</h1>
			<p>Se chegou aqui é porque está logado (via localStorage).</p>
		</main>
	);
}
