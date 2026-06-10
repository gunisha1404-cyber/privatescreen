interface Props { role: "user" | "assistant"; content: string }

export default function Bubble({ role, content }: Props) {
	return (
		<div className={role === "user" ? "sent-msg" : "recv-msg"}>
			{content}
		</div>
	);
}
