"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function MotoboyLoginPage() {
	const [nome, setNome] = useState("");
	const [senha, setSenha] = useState("");
	const router = useRouter();

	async function handleLogin(e) {
		e.preventDefault();

		// Buscar o motoboy pelo nome e senha
		const { data: motoboys, error } = await supabase
			.from("motoboys")
			.select("*")
			.eq("nome", nome)
			.eq("senha", senha); // Nota: em produção, use hashing (bcrypt) ou Supabase Auth

		if (error) {
			console.error(error);
			alert("Erro ao efetuar login");
			return;
		}

		if (motoboys && motoboys.length > 0) {
			const motoboy = motoboys[0];

			// Armazena informação no localStorage (abordagem simples e não-segura)
			localStorage.setItem("motoboyId", motoboy.id);

			// Redireciona para o dashboard
			router.push(`/delivery/${motoboy.id}`);
		} else {
			alert("Usuário ou senha inválidos!");
		}
	}

	return (
		<main className="flex flex-col items-center justify-center h-screen">
			<h1 className="mb-4">Acesse</h1>
			<form onSubmit={handleLogin}>
				<div>
					<input
						className="py-2 px-4 border border-gray-700 rounded mb-4"
						type="text"
						placeholder="Nome do Motoboy"
						value={nome}
						onChange={(e) => setNome(e.target.value)}
					/>
				</div>
				<div>
					<input
						className="py-2 px-4 border border-gray-700 rounded mb-4"
						type="password"
						placeholder="Senha"
						value={senha}
						onChange={(e) => setSenha(e.target.value)}
					/>
				</div>
				<button
					className="py-2 px-4 bg-indigo-500 text-white rounded hover:bg-indigo-600"
					type="submit">
					Fazer login
				</button>
			</form>
		</main>
	);
}
