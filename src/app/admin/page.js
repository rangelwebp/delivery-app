"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AdminLoginPage() {
	const [email, setEmail] = useState("");
	const [senha, setSenha] = useState("");
	const router = useRouter();

	async function handleLogin(e) {
		e.preventDefault();

		const { data, error } = await supabase
			.from("admin")
			.select("*")
			.eq("email", email)
			.eq("senha", senha);

		if (error) {
			console.error(error);
			alert("Erro no login do Admin");
			return;
		}

		if (data && data.length > 0) {
			// Supondo que existe apenas um admin com esse email e senha
			const adminData = data[0];
			// Armazena info no localStorage (não seguro, mas didático)
			localStorage.setItem("adminId", adminData.id);
			localStorage.setItem("adminEmail", adminData.email);

			// Redireciona para o "dashboard" principal do admin
			router.push("/admin/home");
		} else {
			alert("Credenciais de Admin inválidas!");
		}
	}

	return (
		<main className="flex flex-col items-center justify-center h-screen">
			<h1 className="text-3xl font-bold mb-4">Admin</h1>
			<form onSubmit={handleLogin}>
				<div>
					<input
						className="py-2 px-4 border border-zinc-700 rounded mb-4"
						type="text"
						placeholder="E-mail do Admin"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
				<div>
					<input
						className="py-2 px-4 border border-zinc-700 rounded mb-4"
						type="password"
						placeholder="Senha"
						value={senha}
						onChange={(e) => setSenha(e.target.value)}
					/>
				</div>
				<button
					className="py-2 px-4 bg-indigo-500 text-white rounded hover:bg-indigo-600"
					type="submit">
					Entrar na Administração
				</button>
			</form>
		</main>
	);
}
