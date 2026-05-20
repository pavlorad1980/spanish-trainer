import React from "react";
import verbsData from "./data/verbs.json";

export default function SpanishTenseTrainer() {
  const persons = ["yo", "tú", "él / ella", "nosotros", "vosotros", "ellos"];

  const tenses = [
    ["presente", "Presente"],
    ["indefinido", "Pretérito indefinido"],
    ["imperfecto", "Imperfecto"],
    ["futuro", "Futuro simple"],
    ["condicional", "Condicional"],
    ["subjuntivo", "Presente de subjuntivo"],
    ["imperativo", "Imperativo afirmativo"],
  ];

  const tenseNameMap = {
    presente: "Presente",
    indefinido: "Pretérito indefinido",
    imperfecto: "Imperfecto",
    futuro: "Futuro simple",
    condicional: "Condicional",
    subjuntivo: "Presente de subjuntivo",
    imperativo: "Imperativo afirmativo",
  };

  const [verbs, setVerbs] = React.useState(
    verbsData
      .filter((v) => v && v.verb && v.translation)
      .map((v) => [v.verb, v.translation])
  );

  const [customVerb, setCustomVerb] = React.useState("");
  const [customTranslation, setCustomTranslation] = React.useState("");

  const verbTranslations = React.useMemo(() => Object.fromEntries(verbs), [verbs]);

  const verbsByName = React.useMemo(() => {
    return Object.fromEntries(verbsData.map((v) => [v.verb, v]));
  }, []);

  const irregularVerbSet = React.useMemo(() => {
    return new Set(verbsData.filter((v) => v.irregular).map((v) => v.verb));
  }, []);

  function regularForms(verb, tense) {
    const stem = verb.slice(0, -2);
    const ending = verb.slice(-2);

    if (!["ar", "er", "ir"].includes(ending)) return ["", "", "", "", "", ""];

    if (tense === "presente") {
      if (ending === "ar") return [stem + "o", stem + "as", stem + "a", stem + "amos", stem + "áis", stem + "an"];
      if (ending === "er") return [stem + "o", stem + "es", stem + "e", stem + "emos", stem + "éis", stem + "en"];
      return [stem + "o", stem + "es", stem + "e", stem + "imos", stem + "ís", stem + "en"];
    }

    if (tense === "indefinido") {
      if (ending === "ar") return [stem + "é", stem + "aste", stem + "ó", stem + "amos", stem + "asteis", stem + "aron"];
      return [stem + "í", stem + "iste", stem + "ió", stem + "imos", stem + "isteis", stem + "ieron"];
    }

    if (tense === "imperfecto") {
      if (ending === "ar") return [stem + "aba", stem + "abas", stem + "aba", stem + "ábamos", stem + "abais", stem + "aban"];
      return [stem + "ía", stem + "ías", stem + "ía", stem + "íamos", stem + "íais", stem + "ían"];
    }

    if (tense === "futuro") return [verb + "é", verb + "ás", verb + "á", verb + "emos", verb + "éis", verb + "án"];

    if (tense === "condicional") return [verb + "ía", verb + "ías", verb + "ía", verb + "íamos", verb + "íais", verb + "ían"];

    if (tense === "subjuntivo") {
      if (ending === "ar") return [stem + "e", stem + "es", stem + "e", stem + "emos", stem + "éis", stem + "en"];
      return [stem + "a", stem + "as", stem + "a", stem + "amos", stem + "áis", stem + "an"];
    }

    if (tense === "imperativo") {
      if (ending === "ar") return ["", stem + "a", stem + "e", stem + "emos", stem + "ad", stem + "en"];
      if (ending === "er") return ["", stem + "e", stem + "a", stem + "amos", stem + "ed", stem + "an"];
      return ["", stem + "e", stem + "a", stem + "amos", stem + "id", stem + "an"];
    }

    return ["", "", "", "", "", ""];
  }

  function getForm(verb, tense, personIndex) {
    const verbObj = verbsByName[verb];

    if (verbObj?.irregular) {
      const tenseName = tenseNameMap[tense];
      const person = persons[personIndex];
      const savedForm = verbObj.forms?.[tenseName];

      if (savedForm && typeof savedForm === "object") {
        return savedForm[person] || "";
      }

      if (typeof savedForm === "string") {
        return personIndex === 0 ? savedForm : "";
      }

      return "";
    }

    return regularForms(verb, tense)[personIndex] || "";
  }

  const templates = {
    presente: [
      ["Todos los días ___ con más seguridad que antes.", "Каждый день {person} делает это увереннее, чем раньше."],
      ["Normalmente ___ después de terminar las tareas importantes.", "Обычно {person} делает это после важных дел."],
    ],
    indefinido: [
      ["Ayer ___ aunque no tenía mucho tiempo libre.", "Вчера {person} сделал это, хотя свободного времени было мало."],
      ["La semana pasada ___ por primera vez en mucho tiempo.", "На прошлой неделе {person} сделал это впервые за долгое время."],
    ],
    imperfecto: [
      ["Antes ___ casi todos los fines de semana.", "Раньше {person} делал это почти каждые выходные."],
      ["Cuando vivía en otra ciudad, ___ con mucha frecuencia.", "Когда {person} жил в другом городе, он делал это часто."],
    ],
    futuro: [
      ["Mañana ___ si todo sale según lo planeado.", "Завтра {person} сделает это, если всё пойдёт по плану."],
      ["El próximo mes ___ con más disciplina.", "В следующем месяце {person} будет делать это более дисциплинированно."],
    ],
    condicional: [
      ["Si tuviera más tiempo, ___ sin tanta prisa.", "Если бы было больше времени, {person} сделал бы это без такой спешки."],
      ["En una situación diferente, ___ de otra manera.", "В другой ситуации {person} сделал бы это иначе."],
    ],
    subjuntivo: [
      ["Es importante que ___ antes de tomar una decisión.", "Важно, чтобы {person} сделал это до принятия решения."],
      ["Quiero que ___ con más atención la próxima vez.", "Я хочу, чтобы {person} сделал это внимательнее в следующий раз."],
    ],
    imperativo: [
      ["Por favor, ___ antes de salir de casa.", "Пожалуйста, сделай/сделайте это перед выходом из дома."],
      ["___ con calma y no tengas miedo de equivocarte.", "Сделай/сделайте это спокойно и не бойся ошибиться."],
    ],
  };

  const [selectedVerbs, setSelectedVerbs] = React.useState(["hablar", "comer", "vivir"]);
  const [selectedTenses, setSelectedTenses] = React.useState(["presente", "indefinido", "imperfecto"]);
  const [taskCount, setTaskCount] = React.useState(20);
  const [exercises, setExercises] = React.useState([]);
  const [answers, setAnswers] = React.useState({});
  const [checked, setChecked] = React.useState(false);
  const [level, setLevel] = React.useState(1);
  const [showTheory, setShowTheory] = React.useState(false);

  function toggleVerb(verb) {
    setSelectedVerbs((prev) => {
      if (prev.includes(verb)) return prev.filter((v) => v !== verb);
      if (prev.length >= 6) return prev;
      return [...prev, verb];
    });
  }

  function addCustomVerb() {
    const v = customVerb.trim().toLowerCase();
    const ru = customTranslation.trim() || "новый глагол";

    if (!v) return;

    if (!v.endsWith("ar") && !v.endsWith("er") && !v.endsWith("ir")) {
      alert("Глагол должен заканчиваться на -ar, -er или -ir");
      return;
    }

    if (verbs.some(([verb]) => verb === v)) {
      alert("Этот глагол уже есть в списке");
      return;
    }

    setVerbs([...verbs, [v, ru]]);
    setCustomVerb("");
    setCustomTranslation("");
  }

  function toggleTense(tense) {
    setSelectedTenses((prev) =>
      prev.includes(tense) ? prev.filter((t) => t !== tense) : [...prev, tense]
    );
  }

  function speak(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-ES";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }

  function generateOne(index) {
    const verb = selectedVerbs[Math.floor(Math.random() * selectedVerbs.length)];
    const tense = selectedTenses[Math.floor(Math.random() * selectedTenses.length)];
    let personIndex = Math.floor(Math.random() * 6);

    if (tense === "imperativo" && personIndex === 0) personIndex = 1;

    const [template, ru] = templates[tense][Math.floor(Math.random() * templates[tense].length)];
    const correct = getForm(verb, tense, personIndex);

    return {
      id: `${Date.now()}-${index}-${Math.random()}`,
      verb,
      tense,
      tenseLabel: tenses.find((t) => t[0] === tense)?.[1] || tense,
      person: persons[personIndex],
      sentence: template,
      ru: ru.replace("{person}", persons[personIndex]),
      correct,
    };
  }

  function generateExam() {
    if (selectedVerbs.length === 0 || selectedTenses.length === 0) return;
    setShowTheory(false);
    setExercises(Array.from({ length: taskCount }, (_, i) => generateOne(i)));
    setAnswers({});
    setChecked(false);
  }

  function toggleTheory() {
    if (selectedVerbs.length === 0 || selectedTenses.length === 0) return;
    setExercises([]);
    setChecked(false);
    setAnswers({});
    setShowTheory((prev) => !prev);
  }

  function checkExam() {
    setChecked(true);
    const wrong = exercises.filter(
      (ex) => (answers[ex.id] || "").trim().toLowerCase() !== ex.correct.toLowerCase()
    ).length;

    const errorRate = exercises.length ? (wrong / exercises.length) * 100 : 0;

    if (errorRate <= 20 && level < 3) setLevel(level + 1);
    if (errorRate >= 50 && level > 1) setLevel(level - 1);
  }

  const wrongCount = checked
    ? exercises.filter((ex) => (answers[ex.id] || "").trim().toLowerCase() !== ex.correct.toLowerCase()).length
    : 0;

  const total = exercises.length;
  const correctCount = checked ? total - wrongCount : 0;
  const errorPercent = checked && total ? Math.round((wrongCount / total) * 100) : 0;
  const successPercent = checked && total ? Math.round((correctCount / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white rounded-3xl shadow p-6">
          <h1 className="text-3xl font-bold mb-2">Spanish Tenses Examiner</h1>
          <p className="text-slate-600 mb-5">Выбери до 6 глаголов и времена. Стандартный тест — 20 предложений.</p>

          <h2 className="text-xl font-bold mb-3">Добавить свой глагол</h2>
          <div className="grid md:grid-cols-3 gap-3 mb-6">
            <input value={customVerb} onChange={(e) => setCustomVerb(e.target.value)} placeholder="infinitivo: caminar" className="border rounded-xl p-3" />
            <input value={customTranslation} onChange={(e) => setCustomTranslation(e.target.value)} placeholder="перевод: ходить пешком" className="border rounded-xl p-3" />
            <button onClick={addCustomVerb} className="px-5 py-3 rounded-xl bg-black text-white font-semibold">Добавить</button>
          </div>

          <p className="text-sm text-slate-500 mb-6">
            Добавлять можно только правильные глаголы на -ar, -er, -ir.
          </p>

          <h2 className="text-xl font-bold mb-3">1. Глаголы: {selectedVerbs.length}/6</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            {verbs.map(([verb, ru]) => (
              <button key={verb} onClick={() => toggleVerb(verb)} className={`rounded-2xl p-3 border text-left ${selectedVerbs.includes(verb) ? "bg-black text-white" : irregularVerbSet.has(verb) ? "bg-red-50 border-red-300" : "bg-white"}`}>
                <div className={`font-bold ${irregularVerbSet.has(verb) && !selectedVerbs.includes(verb) ? "text-red-600" : ""}`}>{verb}</div>
                <div className={`text-sm opacity-75 ${irregularVerbSet.has(verb) && !selectedVerbs.includes(verb) ? "text-red-500" : ""}`}>{ru}</div>
              </button>
            ))}
          </div>

          <h2 className="text-xl font-bold mb-3">2. Времена</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {tenses.map(([key, label]) => (
              <button key={key} onClick={() => toggleTense(key)} className={`rounded-2xl p-3 border text-left ${selectedTenses.includes(key) ? "bg-blue-600 text-white" : "bg-white"}`}>
                {label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="font-semibold">Количество заданий:</label>
            <input type="number" min="5" max="50" value={taskCount} onChange={(e) => setTaskCount(Number(e.target.value))} className="w-24 border rounded-xl p-2" />
            <div className="px-4 py-2 rounded-xl bg-slate-200">Сложность: {level}/3</div>
            <button onClick={generateExam} className="px-5 py-3 rounded-2xl bg-blue-600 text-white font-semibold">Создать тест</button>
            <button onClick={toggleTheory} className="px-5 py-3 rounded-2xl bg-purple-600 text-white font-semibold">
              {showTheory ? "Скрыть теорию" : "Теория"}
            </button>
            {exercises.length > 0 && <button onClick={checkExam} className="px-5 py-3 rounded-2xl bg-green-600 text-white font-semibold">Проверить всё</button>}
          </div>
        </div>

        {showTheory && (
          <div className="bg-white rounded-3xl shadow p-6 overflow-x-auto">
            <h2 className="text-2xl font-bold mb-4">Теория: выбранные глаголы и времена</h2>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-200">
                  <th className="border p-3 text-left">Глагол</th>
                  <th className="border p-3 text-left">Перевод</th>
                  <th className="border p-3 text-left">Лицо</th>
                  {selectedTenses.map((tense) => (
                    <th key={tense} className="border p-3 text-left">
                      {tenses.find((t) => t[0] === tense)?.[1] || tense}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {selectedVerbs.map((verb) =>
                  persons.map((person, personIndex) => (
                    <tr key={`${verb}-${person}`} className={irregularVerbSet.has(verb) ? "bg-red-50" : "bg-white"}>
                      {personIndex === 0 && (
                        <td rowSpan={6} className={`border p-3 font-bold align-middle ${irregularVerbSet.has(verb) ? "text-red-700" : ""}`}>
                          {verb}
                        </td>
                      )}
                      {personIndex === 0 && (
                        <td rowSpan={6} className={`border p-3 align-middle ${irregularVerbSet.has(verb) ? "text-red-600" : ""}`}>
                          {verbTranslations[verb]}
                        </td>
                      )}
                      <td className="border p-3">{person}</td>
                      {selectedTenses.map((tense) => (
                        <td key={tense} className="border p-3 font-semibold">
                          {getForm(verb, tense, personIndex) || "—"}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {checked && (
          <div className="bg-white rounded-3xl shadow p-6 grid md:grid-cols-4 gap-4">
            <div className="rounded-2xl bg-slate-100 p-4"><div className="text-sm text-slate-500">Всего</div><div className="text-3xl font-bold">{total}</div></div>
            <div className="rounded-2xl bg-slate-100 p-4"><div className="text-sm text-slate-500">Правильно</div><div className="text-3xl font-bold">{successPercent}%</div></div>
            <div className="rounded-2xl bg-slate-100 p-4"><div className="text-sm text-slate-500">Ошибки</div><div className="text-3xl font-bold">{errorPercent}%</div></div>
            <div className="rounded-2xl bg-slate-100 p-4"><div className="text-sm text-slate-500">Неверных ответов</div><div className="text-3xl font-bold">{wrongCount}</div></div>
          </div>
        )}

        <div className="space-y-4">
          {exercises.map((ex, index) => {
            const user = (answers[ex.id] || "").trim().toLowerCase();
            const isWrong = checked && user !== ex.correct.toLowerCase();
            const isCorrect = checked && user === ex.correct.toLowerCase();
            const fullSentence = ex.sentence.replace("___", ex.correct);

            return (
              <div key={ex.id} className={`bg-white rounded-3xl shadow p-5 border ${isWrong ? "border-red-400" : isCorrect ? "border-green-400" : "border-transparent"}`}>
                <div className="flex flex-wrap gap-2 mb-3 text-sm">
                  <span className="px-3 py-1 rounded-xl bg-slate-200">#{index + 1}</span>
                  <span className={`px-3 py-1 rounded-xl ${irregularVerbSet.has(ex.verb) ? "bg-red-100 text-red-700 border border-red-300" : "bg-slate-200"}`}>
                    {ex.verb} — {verbTranslations[ex.verb]}
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-slate-200">{ex.tenseLabel}</span>
                  <span className="px-3 py-1 rounded-xl bg-slate-200">{ex.person}</span>
                  <button onClick={() => speak(fullSentence)} className="px-3 py-1 rounded-xl bg-indigo-600 text-white">🔊 Audio</button>
                </div>

                <div className="text-xl font-semibold mb-2">{ex.sentence}</div>
                <div className="text-slate-600 mb-4">{ex.ru}</div>

                <input
                  value={answers[ex.id] || ""}
                  onChange={(e) => setAnswers({ ...answers, [ex.id]: e.target.value })}
                  placeholder="Впиши форму глагола"
                  className="w-full border rounded-2xl p-3 text-lg"
                />

                {checked && (
                  <div className={`mt-3 rounded-2xl p-3 ${isCorrect ? "bg-green-100" : "bg-red-100"}`}>
                    {isCorrect ? (
                      <div className="font-semibold text-green-800">Правильно</div>
                    ) : (
                      <div className="text-red-800">
                        <div className="font-semibold">Ошибка</div>
                        <div>Твой ответ: {answers[ex.id] || "—"}</div>
                        <div>Правильно: {ex.correct}</div>
                        <div>Полное предложение: {fullSentence}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}