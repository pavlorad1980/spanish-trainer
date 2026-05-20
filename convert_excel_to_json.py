import pandas as pd
import json

# Загружаем Excel
file_path = "verbs.xlsx"

df = pd.read_excel(file_path)

verbs = {}

for _, row in df.iterrows():
    verb = str(row["Verbo"]).strip()
    translation = str(row["Перевод"]).strip()

    is_irregular = (
        str(row["Irregular"]).strip().lower() == "yes"
    )

    if verb not in verbs:
        verbs[verb] = {
            "translation": translation,
            "forms": {},
            "irregular": is_irregular
        }

    for tense in df.columns[3:]:
        if tense not in verbs[verb]["forms"]:
            verbs[verb]["forms"][tense] = str(row[tense]).strip()

# Преобразуем в список
result = []

for verb, data in verbs.items():
    result.append({
        "verb": verb,
        "translation": data["translation"],
        "irregular": data["irregular"],
        "forms": data["forms"]
    })

# Сохраняем JSON
with open("src/data/verbs.json", "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print("verbs.json created successfully!")