import CuteTerminal from "./CuteTerminal";
import styles from "./App.module.scss";
import { main } from "../content/main";
import Main from "../content/Main.tsx";
import { useEffect, useState, useCallback } from "react";
import { logger } from "./logger";

function App() {
    const [logs, setLogs] = useState<string[]>([]);
    const [resultVal, setResultVal] = useState<any>(null);
    const [showMain, setShowMain] = useState(false);
    const [showToolbar, setShowToolbar] = useState(true);
    const [isHoveringTop, setIsHoveringTop] = useState(false);

    const handleRerun = useCallback(() => {
        logger.reset();
        try {
            const res = main();
            setResultVal(res);
        } catch (e: any) {
            logger.error(e.message || String(e));
        }
    }, [main]);

    useEffect(() => {
        handleRerun();
    }, [handleRerun]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setIsHoveringTop(e.clientY <= 30);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    useEffect(() => {
        const unsubscribe = logger.subscribe((entry) => {
            if (entry.type === "reset") {
                setLogs([]);
                return;
            }
            setLogs((prev) => [...prev, `[${entry.type.toUpperCase()}] ${entry.message}`]);
        });
        return unsubscribe;
    }, []);

    return (
        <div className={styles.appContainer}>
            <button
                className={`${styles.toolbarToggleBtn} ${isHoveringTop ? styles.visible : ""}`}
                onClick={() => setShowToolbar(!showToolbar)}
                title={showToolbar ? "Hide Toolbar" : "Show Toolbar"}
            >
                {showToolbar ?
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="18 15 12 9 6 15"></polyline>
                    </svg>
                :   <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                }
            </button>

            {showToolbar && (
                <div className={styles.toolbar}>
                    <div className={styles.viewToggle}>
                        <span>Show UI</span>
                        <label className={styles.switch}>
                            <input type="checkbox" checked={showMain} onChange={(e) => setShowMain(e.target.checked)} />
                            <span className={styles.slider}></span>
                        </label>
                    </div>
                    <button
                        className={styles.rerunBtn}
                        onClick={handleRerun}
                        style={{ visibility: showMain ? "hidden" : "visible" }}
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ marginRight: "8px" }}
                        >
                            <polyline points="23 4 23 10 17 10"></polyline>
                            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                        </svg>
                        Run main.ts
                    </button>
                </div>
            )}
            {showMain ?
                <div className={styles.mainContainer}>
                    <Main />
                </div>
            :   <div className={styles.terminalContainer}>
                    <CuteTerminal title="result" text={JSON.stringify(resultVal, null, 2)} />
                    <CuteTerminal title="log" text={logs.join("\n")} />
                </div>
            }
        </div>
    );
}

export default App;
