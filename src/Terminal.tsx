import styles from "./Terminal.module.scss";

export default function Terminal({ title = "typescript-playground", text = "", prompt = ">", showCopy = true }) {
    const rawText = Array.isArray(text) ? text.join("\n") : String(text);

    function handleCopy() {
        navigator.clipboard?.writeText(rawText).catch(() => {});
    }

    const lines: { type: string; content: string }[] = [];
    let currentType = "default";

    rawText.split("\n").forEach((line) => {
        const lowerLine = line.toLowerCase();
        if (lowerLine.startsWith("[error]")) {
            currentType = "error";
            lines.push({ type: currentType, content: line.substring(7).trim() });
        } else if (lowerLine.startsWith("[warn]") || lowerLine.startsWith("[warning]")) {
            currentType = "warning";
            const prefixLen = lowerLine.startsWith("[warning]") ? 9 : 6;
            lines.push({ type: currentType, content: line.substring(prefixLen).trim() });
        } else if (lowerLine.startsWith("[info]")) {
            currentType = "info";
            lines.push({ type: currentType, content: line.substring(6).trim() });
        } else {
            lines.push({ type: currentType, content: line });
        }
    });

    return (
        <div className={styles.terminalWrapper}>
            <div className={styles.terminalHeader}>
                <div className={styles.terminalButtons}>
                    <span className={`${styles.btn} ${styles.red}`}></span>
                    <span className={`${styles.btn} ${styles.yellow}`}></span>
                    <span className={`${styles.btn} ${styles.green}`}></span>
                </div>
                <div className={styles.title}>{title}</div>
                <div className={styles.actions}>
                    {showCopy && (
                        <button onClick={handleCopy} className={styles.actionBtn}>
                            Copy
                        </button>
                    )}
                </div>
            </div>
            <div className={styles.terminalBody}>
                <pre>
                    {lines.map((line, idx) => (
                        <div key={idx} className={`${styles.line} ${styles[line.type]}`}>
                            <span className={styles.prompt}>{prompt}</span>
                            <span>{line.content}</span>
                        </div>
                    ))}
                </pre>
            </div>
        </div>
    );
}
