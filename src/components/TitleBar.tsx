interface Props {
	onMinimize: () => void;
	onClose: () => void;
}

export default function TitleBar({ onMinimize, onClose }: Props) {
	return (
		<div className="titlebar">
			<div className="titlebar-brand" onClick={onMinimize}>𝔗𝔢𝔵𝔇𝔬𝔪𝔬𝔫𝔦𝔞𝔱𝔬𝔯</div>
			<div className="titlebar-btns">
				<button className="titlebar-btn" onClick={onMinimize} title="Minimize">—</button>
				<button className="titlebar-btn close" onClick={onClose} title="Close">×</button>
			</div>
		</div>
	);
}
