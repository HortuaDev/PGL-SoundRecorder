# PGL-SoundRecorder

Aplicación de grabadora de audio desarrollada con React Native, Expo y TypeScript.

## Descripción

PGL-SoundRecorder permite grabar audios desde el micrófono del dispositivo, listarlos, reproducirlos individualmente y eliminarlos. Los audios grabados se persisten entre sesiones mediante AsyncStorage. La app solicita permisos de micrófono al usuario y gestiona correctamente los casos en que se deniegan, incluyendo la redirección a los ajustes del sistema cuando el sistema ya no permite volver a preguntar.

## Funcionalidades

- Solicitud de permisos de micrófono con pantalla dedicada
- Grabación y parada de audio con botón animado
- Animación de pulso en el botón durante la grabación
- Indicador visual animado (Loader) durante la grabación y la carga inicial
- Contador de segundos en tiempo real durante la grabación
- Listado de grabaciones con fecha y hora
- Reproducción individual con indicador de estado activo
- Los demás audios se deshabilitan visualmente mientras uno se reproduce
- Eliminación individual de grabaciones
- Eliminación total con confirmación previa
- Persistencia de datos entre sesiones con AsyncStorage
- Animaciones propias con la API Animated de React Native
- Pantalla de permisos denegados con opción de reintento o apertura de ajustes del sistema

## Instalación y ejecución

```bash
npm install
npx expo start
```

Pulsa `a` para abrir en el emulador de Android o escanea el QR con Expo Go.

## Documentación

- [Diseño de la pantalla](./docs/design.md)
- [Implementación técnica](./docs/implementation.md)

## Tecnologías utilizadas

- React Native + Expo (TypeScript)
- expo-audio
- AsyncStorage
- react-native-safe-area-context
- Animated API de React Native :

> **Nota:** Inicialmente se planteó usar `react-native-reanimated`, pero causaba
> errores de compatibilidad con la versión de Expo y la Nueva Arquitectura de
> React Native. Tras investigar, encontré la API `Animated` integrada en React
> Native, que cumple el mismo propósito sin dependencias externas adicionales.
> La actividad pide "animaciones propias" sin especificar librería, así que
> aproveché el contratiempo para explorar una alternativa nativa. :)
