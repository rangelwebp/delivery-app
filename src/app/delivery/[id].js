"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function DeliveryDashboard() {
	const router = useRouter();
	const params = useParams();
	const { id } = params; // ID do motoboy na URL

	const [entregas, setEntregas] = useState([]);

	// 1. Verifica se o motoboy está logado (client-side)
	// 2. Se não estiver, redireciona para '/'
	useEffect(() => {
		const motoboyId = localStorage.getItem("motoboyId");
		if (!motoboyId) {
			router.push("/");
		} else if (motoboyId !== id) {
			// Se o id na URL não for o mesmo que no localStorage,
			// significa que o usuário pode ter tentado acessar outra conta
			router.push("/");
		} else {
			// Carrega as entregas do motoboy
			fetchEntregas(motoboyId);
		}
	}, [id]);

	async function fetchEntregas(motoboyId) {
		const { data, error } = await supabase
			.from("entregas")
			.select("*")
			.eq("motoboy_id", motoboyId)
			.order("created_at", { ascending: false });

		if (error) {
			console.error(error);
		} else {
			setEntregas(data);
		}
	}

	// Função para atualizar status
	async function atualizarStatus(entregaId, novoStatus) {
		const { data, error } = await supabase
			.from("entregas")
			.update({ status_entrega: novoStatus })
			.eq("id", entregaId);

		if (error) {
			console.error(error);
		} else {
			// Recarrega a lista de entregas
			const motoboyId = localStorage.getItem("motoboyId");
			if (motoboyId) {
				fetchEntregas(motoboyId);
			}
		}
	}

	// Se o motoboy não estiver logado ou estiver carregando, podemos retornar algo básico
	// Mas aqui só exibimos a lista após o fetch
	return (
		<main style={{ margin: "20px" }}>
			<h1>Delivery Dashboard (Motoboy ID: {id})</h1>
			<ul>
				{entregas.map((entrega) => (
					<li key={entrega.id}>
						<strong>{entrega.endereco}</strong> -{" "}
						{entrega.forma_pagamento} - {entrega.status_entrega}
						<button
							onClick={() =>
								atualizarStatus(entrega.id, "Entregue")
							}
							disabled={entrega.status_entrega === "Entregue"}>
							Marcar como Entregue
						</button>
						<button
							onClick={() =>
								atualizarStatus(entrega.id, "A Entregar")
							}
							disabled={entrega.status_entrega === "A Entregar"}>
							Marcar como A Entregar
						</button>
					</li>
				))}
			</ul>
		</main>
	);
}
