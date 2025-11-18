# Tarjetas de Prueba – Webpay (Ambiente de Integración)

Para realizar transacciones en el ambiente **sandbox** de Webpay, se deben utilizar las siguientes **tarjetas de prueba**.  
Estas tarjetas no representan instrumentos reales y funcionan únicamente en el entorno de integración.

---

## 🧾 Tarjetas Crédito/Débito de Prueba

| Tipo de tarjeta     | Número / Datos                                         | Resultado esperado |
|---------------------|---------------------------------------------------------|--------------------|
| **VISA**            | Número: `4051 8856 0044 6623`  <br> CVV: `123` <br> Exp: cualquier fecha | **Aprobada** |
| **AMEX**            | Número: `3700 0000 0002 032` <br> CVV: `1234` <br> Exp: cualquier fecha | **Aprobada** |
| **MASTERCARD**      | Número: `5186 0595 5959 0568` <br> CVV: `123` <br> Exp: cualquier fecha | **Rechazada** |

---

## 🏧 Tarjetas Redcompra (Débito)

| Tipo                | Número                                                 | Resultado esperado |
|---------------------|---------------------------------------------------------|--------------------|
| **Redcompra**       | `4051 8842 3993 7763` | **Aprobada** |
| **Redcompra**       | `4511 3466 6003 7060` | **Aprobada** |
| **Redcompra**       | `5186 0085 4123 3829` | **Rechazada** |

---

## 💳 Tarjetas Prepago

| Tipo                    | Número / Datos                                         | Resultado esperado |
|-------------------------|---------------------------------------------------------|--------------------|
| **Prepago VISA**        | Número: `4051 8860 0005 6590` <br> CVV: `123` <br> Exp: cualquier fecha | **Aprobada** |
| **Prepago MASTERCARD**  | Número: `5186 1741 1062 9480` <br> CVV: `123` <br> Exp: cualquier fecha | **Rechazada** |

---

## 🔐 Autenticación para formularios con RUT/clave

En operaciones donde se solicite autenticación con RUT y clave, utilizar:

- **RUT:** `11.111.111-1`  
- **Clave:** `123`

---

> Estas credenciales son válidas **solo** en el entorno de integración provisto por Transbank.
