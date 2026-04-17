[← Volver al inicio](../README.md)

# Ejercicio 1 – Diseño de la pantalla de grabación

## Enunciado

> Diseña una nueva pantalla de grabación en tu aplicación que disponga de los siguientes elementos:
>
> - Botón para grabar y parar grabación.
> - Indicador o animación de grabación en curso.
> - Listado de audios grabados.
> - Elemento para reproducir individualmente un audio grabado.
> - Botón para eliminar todos los audios guardados o cada audio individualmente.

---

## Descripción general

La aplicación tiene una única pantalla principal que centraliza todas las funcionalidades: grabar, listar, reproducir y eliminar audios. El diseño usa una estética oscura con acentos en rojo para acciones principales y verde para indicar reproducción activa.

---

## Pantalla principal en reposo

|                                                 Diseño (Figma)                                                 |                                             Resultado final                                             |
| :------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------: |
| <img src="../assets/figma-pantalla-principal-sin-grabaciones.png" width="200" alt="Figma – sin grabaciones" /> | <img src="../assets/pantalla-principal-sin-grabaciones.png" width="200" alt="Real – sin grabaciones" /> |

### Con grabaciones en lista

|                                                 Diseño (Figma)                                                 |                                             Resultado final                                             |
| :------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------: |
| <img src="../assets/figma-pantalla-principal-con-grabaciones.png" width="200" alt="Figma – con grabaciones" /> | <img src="../assets/pantalla-principal-con-grabaciones.png" width="200" alt="Real – con grabaciones" /> |

---

## Elementos diseñados

### Botón de grabación (RecordButton)

Botón principal de la pantalla. Cambia de apariencia y comportamiento según el estado de grabación.

- **Reposo:** fondo rojo (`#e74c3c`), texto `"⏺  Iniciar grabación"`
- **Grabando:** fondo rojo oscuro (`#c0392b`), texto `"⏹  Parar grabación"`
- **Animación:** pulso continuo suave con escala 1 → 1.08 mientras graba, vuelve a escala 1 al parar

|                                          Diseño (Figma) – reposo                                           |                                      Resultado final – reposo                                       |
| :--------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------: |
| <img src="../assets/figma-boton-grabacion-iniciar-grabacion.png" width="200" alt="Figma – botón reposo" /> | <img src="../assets/boton-grabacion-iniciar-grabacion.png" width="200" alt="Real – botón reposo" /> |

|                                      Diseño (Figma) – grabando                                      |                                  Resultado final – grabando                                  |
| :-------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------: |
| <img src="../assets/figma-boton-grabacion-grabando.png" width="200" alt="Figma – botón grabando" /> | <img src="../assets/boton-grabacion-grabando.png" width="200" alt="Real – botón grabando" /> |

---

### Indicador de grabación (Loader)

Componente propio de animación visible durante la grabación activa, junto al contador de segundos en tiempo real.

Consiste en un círculo rojo que anima simultáneamente su escala (1 → 1.6) y su opacidad (1 → 0.3) en bucle infinito.

|                                   Diseño (Figma)                                   |                               Resultado final                               |
| :--------------------------------------------------------------------------------: | :-------------------------------------------------------------------------: |
| <img src="../assets/figma-loader-grabando.png" width="100" alt="Figma – loader" /> | <img src="../assets/loader-grabando.png" width="100" alt="Real – loader" /> |

### Pantalla durante la grabación

|                                             Diseño (Figma)                                              |                                         Resultado final                                          |
| :-----------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------: |
| <img src="../assets/figma-pantalla-inicial-durante-grabacion.png" width="200" alt="Figma – grabando" /> | <img src="../assets/pantalla-inicial-durante-grabacion.png" width="200" alt="Real – grabando" /> |

---

### Lista de grabaciones (AudioItem)

Cada elemento de la lista muestra:

- Fecha y hora de la grabación
- Indicador verde `"▶ Reproduciendo..."` cuando está activo
- Botón **Reproducir** (azul), cambia a **Repetir** (verde) mientras el audio suena
- Botón **Eliminar** (rojo oscuro)
- Cuando un audio se reproduce, los demás aparecen con opacidad reducida y el botón de reproducir deshabilitado para evitar superposiciones

|                                           Diseño (Figma)                                            |                                       Resultado final                                        |
| :-------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------: |
| <img src="../assets/figma-grabacion-reproduciendose.png" width="200" alt="Figma – reproduciendo" /> | <img src="../assets/grabacion-reproduciendose.png" width="200" alt="Real – reproduciendo" /> |

---

### Botón eliminar todas las grabaciones

Solo visible cuando hay al menos una grabación en la lista. Muestra un diálogo de confirmación antes de eliminar y detiene cualquier reproducción activa al confirmar.

|                                                 Diseño (Figma)                                                  |                                             Resultado final                                              |
| :-------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------: |
| <img src="../assets/figma-boton-eliminar-todas-las-grabaciones.png" width="200" alt="Figma – eliminar todas" /> | <img src="../assets/boton-eliminar-todas-las-grabaciones.png" width="200" alt="Real – eliminar todas" /> |

---

## Paleta de colores

Todos los colores están centralizados en `styles/global.ts` como tokens reutilizables en todos los componentes.

| Token           | Valor     | Uso                                 |
| --------------- | --------- | ----------------------------------- |
| `background`    | `#1a1a2e` | Fondo principal de la app           |
| `surface`       | `#16213e` | Fondo de cada item de audio         |
| `surfaceActive` | `#1a2e1a` | Fondo de item en reproducción       |
| `primary`       | `#e74c3c` | Botón grabar, loader, borde de item |
| `primaryDark`   | `#c0392b` | Botón grabando activo               |
| `success`       | `#2ecc71` | Indicador de reproducción activa    |
| `info`          | `#2980b9` | Botón reproducir                    |
| `danger`        | `#922b21` | Botón eliminar                      |
| `disabled`      | `#555`    | Botón reproducir deshabilitado      |
| `textPrimary`   | `#ffffff` | Texto principal                     |
| `textSecondary` | `#aaa`    | Fechas y textos secundarios         |
| `textDisabled`  | `#999`    | Texto en estado deshabilitado       |

---

[← Volver al inicio](../README.md)
