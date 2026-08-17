import { useState } from "react";

const initial = {
  tipo: "",
  distanciaMetros: "",
  duracaoMinutos: "",
  calorias: ""
};

export default function ActivityForm({ onSubmit }) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();

    const next = {};
    for (const [key, value] of Object.entries(form)) {
      if (!String(value).trim()) next[key] = "Campo obrigatório";
    }

    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }

    await onSubmit({
      tipo: form.tipo,
      distanciaMetros: Number(form.distanciaMetros),
      duracaoMinutos: Number(form.duracaoMinutos),
      calorias: Number(form.calorias)
    });

    setForm(initial);
    setErrors({});
  }

  return (
    <form className="activity-form" onSubmit={submit}>
      <h2>Crie sua atividade</h2>

      <div className="form-grid">
        <Field
          label="Tipo da atividade"
          name="tipo"
          value={form.tipo}
          onChange={change}
          error={errors.tipo}
          placeholder="Ex: Caminhada"
          select
        />

        <Field
          label="Distância percorrida"
          name="distanciaMetros"
          value={form.distanciaMetros}
          onChange={change}
          error={errors.distanciaMetros}
          placeholder="Ex: 1000 metros"
          type="number"
          min="1"
        />

        <Field
          label="Duração da atividade"
          name="duracaoMinutos"
          value={form.duracaoMinutos}
          onChange={change}
          error={errors.duracaoMinutos}
          placeholder="Ex: 120 min"
          type="number"
          min="1"
        />

        <Field
          label="Quantidade de calorias"
          name="calorias"
          value={form.calorias}
          onChange={change}
          error={errors.calorias}
          placeholder="Ex: 300"
          type="number"
          min="1"
        />
      </div>

      <button className="primary-btn" type="submit">Criar Atividade</button>
    </form>
  );
}

function Field({ label, name, value, onChange, error, placeholder, select, ...props }) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>

      {select ? (
        <select id={name} name={name} value={value} onChange={onChange} className={error ? "invalid" : ""}>
          <option value="">Selecione</option>
          <option value="corrida">Corrida</option>
          <option value="caminhada">Caminhada</option>
          <option value="trilha">Trilha</option>
        </select>
      ) : (
        <input
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={error ? "invalid" : ""}
          {...props}
        />
      )}

      {error && <small className="field-error">{error}</small>}
    </div>
  );
}
