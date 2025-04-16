"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AdminEntregasPage() {
	const router = useRouter();
	const [adminAutenticado, setAdminAutenticado] = useState(false);

	// Estados para listar entregas e motoboys
	const [entregas, setEntregas] = useState([]);
	const [motoboys, setMotoboys] = useState([]);

	// Estados para o formulário de criação de entrega
	const [endereco, setEndereco] = useState("");
	const [formaPagamento, setFormaPagamento] = useState("PIX");
	const [statusEntrega, setStatusEntrega] = useState("A Entregar");
	const [motoboyId, setMotoboyId] = useState("");

	// 1. Verificar se admin está logado
	useEffect(() => {
		const adminId = localStorage.getItem("adminId");
		if (!adminId) {
			router.push("/admin"); // se não tiver logado, vai pro login
		} else {
			setAdminAutenticado(true);
			// Se estiver logado, buscar entregas e motoboys
			fetchEntregas();
			fetchMotoboys();
		}
	}, []);

	// 2. Função para buscar todas entregas
	async function fetchEntregas() {
		const { data, error } = await supabase
			.from("entregas")
			.select("*, motoboys!inner(*)") // faz join com tabela motoboys
			.order("created_at", { ascending: false });

		if (error) {
			console.error("Erro ao buscar entregas", error);
		} else {
			setEntregas(data);
		}
	}

	// 3. Função para buscar motoboys (para preencher select)
	async function fetchMotoboys() {
		const { data, error } = await supabase.from("motoboys").select("*");
		if (error) {
			console.error("Erro ao buscar motoboys", error);
		} else {
			setMotoboys(data);
		}
	}

	// 4. Função para criar nova entrega
	async function criarEntrega(e) {
		e.preventDefault();

		// Monta o objeto
		const novaEntrega = {
			endereco,
			forma_pagamento: formaPagamento,
			status_entrega: statusEntrega,
			motoboy_id: motoboyId,
		};

		const { data, error } = await supabase
			.from("entregas")
			.insert([novaEntrega]);

		if (error) {
			console.error("Erro ao criar entrega", error);
		} else {
			// limpa o form
			setEndereco("");
			setFormaPagamento("PIX");
			setStatusEntrega("A Entregar");
			setMotoboyId("");
			// atualiza a lista
			fetchEntregas();
		}
	}

	if (!adminAutenticado) {
		return <p>Verificando credenciais...</p>;
	}

	return (
		<main style={{ margin: "20px" }}>
			<h1 className="text-3xl mb-4 semibold">Gerenciar Entregas</h1>

			{/* Formulário para criar uma nova entrega */}
			<form onSubmit={criarEntrega} style={{ marginBottom: "20px" }}>
				<div className="flex flex-col gap-2">
					<label>Endereço: </label>
					<input
						className="py-2 px-4 border border-zinc-700 rounded mb-4"
						value={endereco}
						onChange={(e) => setEndereco(e.target.value)}
						required
					/>
				</div>
				<div className="flex flex-col gap-2">
					<label>Forma de Pagamento: </label>
					<select
						className="py-2 px-4 border border-zinc-700 rounded mb-4"
						value={formaPagamento}
						onChange={(e) => setFormaPagamento(e.target.value)}>
						<option value="PIX">PIX</option>
						<option value="Cartão">Cartão</option>
					</select>
				</div>
				<div className="flex flex-col gap-2">
					<label>Status: </label>
					<select
						className="py-2 px-4 border border-zinc-700 rounded mb-4"
						value={statusEntrega}
						onChange={(e) => setStatusEntrega(e.target.value)}>
						<option value="A Entregar">A Entregar</option>
						<option value="Entregue">Entregue</option>
					</select>
				</div>
				<div className="flex flex-col gap-2">
					<label>Motoboy: </label>
					<select
						className="py-2 px-4 border border-zinc-700 rounded mb-4 text-zinc-900"
						value={motoboyId}
						onChange={(e) => setMotoboyId(e.target.value)}
						required>
						<option value="">-- Selecione --</option>
						{motoboys.map((m) => (
							<option key={m.id} value={m.id}>
								{m.nome} - {m.placa}
							</option>
						))}
					</select>
				</div>
				<button
					className="py-2 px-4 bg-indigo-500 text-white rounded cursor-pointer hover:bg-indigo-600"
					type="submit">
					Cadastrar Entrega
				</button>
			</form>

			<hr className="my-14 border-zinc-700" />

			{/* Lista de entregas */}
			<h2 className="mb-4 text-2xl">Lista de Entregas</h2>
			<ul>
				{entregas.map((entrega) => (
					<li key={entrega.id}>
						<strong>{entrega.endereco}</strong> |{" "}
						{entrega.forma_pagamento} | Motoboy:{" "}
						{entrega.motoboys?.nome} - {entrega.motoboys?.placa} |{" "}
						{entrega.status_entrega}
					</li>
				))}
			</ul>
		</main>
	);
}
