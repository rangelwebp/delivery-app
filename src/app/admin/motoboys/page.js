"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AdminMotoboysPage() {
	const router = useRouter();
	const [adminAutenticado, setAdminAutenticado] = useState(false);

	// Estados para listar e cadastrar motoboys
	const [motoboys, setMotoboys] = useState([]);
	const [nome, setNome] = useState("");
	const [placa, setPlaca] = useState("");
	const [senha, setSenha] = useState("");

	useEffect(() => {
		const adminId = localStorage.getItem("adminId");
		if (!adminId) {
			router.push("/admin"); // se não tiver logado
		} else {
			setAdminAutenticado(true);
			fetchMotoboys();
		}
	}, []);

	async function fetchMotoboys() {
		const { data, error } = await supabase
			.from("motoboys")
			.select("*")
			.order("created_at", { ascending: false });

		if (error) {
			console.error("Erro ao buscar motoboys", error);
		} else {
			setMotoboys(data);
		}
	}

	async function criarMotoboy(e) {
		e.preventDefault();
		const { data, error } = await supabase.from("motoboys").insert([
			{
				nome,
				placa,
				senha, // lembre-se: em produção, use hashing em vez de texto puro!
			},
		]);

		if (error) {
			console.error("Erro ao criar motoboy", error);
		} else {
			// Limpa formulário
			setNome("");
			setPlaca("");
			setSenha("");
			// Atualiza a lista
			fetchMotoboys();
		}
	}

	if (!adminAutenticado) {
		return <p>Verificando credenciais...</p>;
	}

	return (
		<main style={{ margin: "20px" }}>
			<h1 className="text-3xl mb-4 semibold">Gerenciar Motoboys</h1>

			<form onSubmit={criarMotoboy}>
				<div className="flex flex-col gap-2">
					<label>Nome: </label>
					<input
						className="py-2 px-4 border border-zinc-700 rounded mb-4"
						value={nome}
						onChange={(e) => setNome(e.target.value)}
						required
					/>
				</div>
				<div className="flex flex-col gap-2">
					<label>Placa: </label>
					<input
						className="py-2 px-4 border border-zinc-700 rounded mb-4"
						value={placa}
						onChange={(e) => setPlaca(e.target.value)}
						required
					/>
				</div>
				<div className="flex flex-col gap-2">
					<label>Senha: </label>
					<input
						className="py-2 px-4 border border-zinc-700 rounded mb-4"
						type="password"
						value={senha}
						onChange={(e) => setSenha(e.target.value)}
						required
					/>
				</div>
				<button
					className="py-2 px-4 bg-indigo-500 text-white rounded cursor-pointer hover:bg-indigo-600"
					type="submit">
					Cadastrar Motoboy
				</button>
			</form>

			<hr className="my-14 border-zinc-700" />

			<h2 className="mb-4 text-2xl">Lista de Motoboys</h2>
			<table className="table-auto w-full border-collapse border border-zinc-700">
				<thead className="table-header-group p-2">
					<tr>
						<th className="border border-zinc-700 uppercase text-sm p-2">
							Nome
						</th>
						<th className="border border-zinc-700 uppercase text-sm p-2">
							Placa
						</th>
					</tr>
				</thead>
				<tbody>
					{motoboys.map((m) => (
						<tr key={m.id}>
							<td className="border border-zinc-700 text-center p-2">
								{m.nome}
							</td>
							<td className="border border-zinc-700 text-center p-2">
								{m.placa}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</main>
	);
}
