 locales['foreman_remote_execution'] = locales['foreman_remote_execution'] || {}; locales['foreman_remote_execution']['es'] = {
  "domain": "foreman_remote_execution",
  "locale_data": {
    "foreman_remote_execution": {
      "": {
        "Project-Id-Version": "foreman_remote_execution 9.0.1",
        "Report-Msgid-Bugs-To": "",
        "PO-Revision-Date": "2016-02-15 13:54+0000",
        "Last-Translator": "FULL NAME <EMAIL@ADDRESS>",
        "Language-Team": "Spanish (http://www.transifex.com/foreman/foreman/language/es/)",
        "MIME-Version": "1.0",
        "Content-Type": "text/plain; charset=UTF-8",
        "Content-Transfer-Encoding": "8bit",
        "Language": "es",
        "Plural-Forms": "nplurals=3; plural=n == 1 ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;",
        "lang": "es",
        "domain": "foreman_remote_execution",
        "plural_forms": "nplurals=3; plural=n == 1 ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;"
      },
      "Another interface is already set as execution. Are you sure you want to use this one instead?": [
        "Ya hay otra interfaz establecida como ejecución. ¿Está seguro de que desea utilizar esta en cambio?"
      ],
      "There was an error while updating the status, try refreshing the page.": [
        "Se produjo un error al actualizar el estado, intente actualizar la página."
      ],
      "List foreign input sets": [
        "Listar conjuntos de entrada externos"
      ],
      "Show foreign input set details": [
        "Mostrar detalles del conjunto de entrada externo"
      ],
      "Target template ID": [
        "ID de la plantilla de destino"
      ],
      "Include all inputs from the foreign template": [
        "Incluir todas las entradas de la plantilla externa"
      ],
      "A comma separated list of input names to be included from the foreign template.": [
        "Una lista de nombres de entrada separados por comas que se incluirá desde la plantilla externa."
      ],
      "Input set description": [
        "Descripción del conjunto de entrada"
      ],
      "Create a foreign input set": [
        "Crear un conjunto de entrada externo"
      ],
      "Delete a foreign input set": [
        "Eliminar un conjunto de entrada externo"
      ],
      "Update a foreign input set": [
        "Actualizar un conjunto de entrada externo"
      ],
      "List job invocations": [
        "Listar invocaciones de trabajo"
      ],
      "Show job invocation": [
        "Mostrar invocación de trabajo"
      ],
      "Show Job status for the hosts": [
        "Mostrar el estado del trabajo de los anfitriones"
      ],
      "The job template to use, parameter is required unless feature was specified": [
        "La plantilla de trabajo que se debe utilizar; se requiere el parámetro a menos que se haya especificado la funcionalidad"
      ],
      "Invocation type, one of %s": [
        "Tipo de invocación, una de %s"
      ],
      "Execute the jobs on hosts in randomized order": [
        "Ejecutar las tareas en los hosts en orden aleatorio"
      ],
      "Inputs to use": [
        "Entradas que se deben utilizar"
      ],
      "SSH provider specific options": [
        "Opciones específicas del proveedor SSH"
      ],
      "What user should be used to run the script (using sudo-like mechanisms). Defaults to a template parameter or global setting.": [
        "El usuario que se debe utilizar para ejecutar el script (con mecanismos tipo sudo). El valor predeterminado es un parámetro de plantilla o una configuración global."
      ],
      "Set password for effective user (using sudo-like mechanisms)": [
        "Establecer la contraseña para el usuario efectivo (utilizando mecanismos similares a sudo)"
      ],
      "Set SSH user": [
        ""
      ],
      "Set SSH password": [
        "Establecer contraseña SSH"
      ],
      "Set SSH key passphrase": [
        "Establecer frase de contraseña de clave SSH"
      ],
      "Create a recurring job": [
        "Crear un trabajo recurrente"
      ],
      "How often the job should occur, in the cron format": [
        "Con qué frecuencia debe ocurrir el trabajo, en formato programado"
      ],
      "Repeat a maximum of N times": [
        "Repetir un máximo de N veces"
      ],
      "Perform no more executions after this time": [
        "No ejecutar más después de esta cantidad de veces"
      ],
      "Designation of a special purpose": [
        "Designación de un objetivo especial"
      ],
      "Schedule the job to start at a later time": [
        "Programar el trabajo para que comience más tarde"
      ],
      "Schedule the job for a future time": [
        "Programar el trabajo para el futuro"
      ],
      "Indicates that the action should be cancelled if it cannot be started before this time.": [
        "Indica que la acción se debe cancelar si no se puede iniciar antes de este momento."
      ],
      "Control concurrency level and distribution over time": [
        "Controlar el nivel de concurrencia y la distribución en el tiempo"
      ],
      "Run at most N tasks at a time": [
        "Ejecutar un máximo de N tareas por vez"
      ],
      "Override the description format from the template for this invocation only": [
        "Sustituir el formato de descripción de la plantilla solo para esta invocación"
      ],
      "Override the timeout interval from the template for this invocation only": [
        "Anular el intervalo del tiempo de expiración desde la plantilla solo para esta invocación"
      ],
      "Remote execution feature label that should be triggered, job template assigned to this feature will be used": [
        "La etiqueta para la funcionalidad de ejecución remota que se debería desencadenar; se utilizará la plantilla de trabajo asignada a esta funcionalidad"
      ],
      "Override the global time to pickup interval for this invocation only": [
        ""
      ],
      "Create a job invocation": [
        "Crear una invocación de trabajo"
      ],
      "Get output for a host": [
        "Obtener salida para un host"
      ],
      "Get raw output for a host": [
        "Obtener salida sin procesar para un host"
      ],
      "Cancel job invocation": [
        "Cancelar invocación de trabajo"
      ],
      "The job could not be cancelled.": [
        "No se pudo cancelar el trabajo."
      ],
      "Rerun job on failed hosts": [
        "Volver a ejecutar el trabajo en hosts con error"
      ],
      "Could not rerun job %{id} because its template could not be found": [
        "No se pudo volver a ejecutar el trabajo %{id} porque no se pudo encontrar su plantilla"
      ],
      "Get outputs of hosts in a job": [
        "Obtener salidas de hosts en un trabajo"
      ],
      "Host with id '%{id}' was not found": [
        "No se encontró el host con ID '%{id}'."
      ],
      "Only one of feature or job_template_id can be specified": [
        "Sólo se puede especificar uno de feature o job_template_id"
      ],
      "List job templates": [
        "Listar plantillas de trabajo"
      ],
      "List job templates per location": [
        "Listar plantillas de trabajo por ubicación"
      ],
      "List job templates per organization": [
        "Listar plantillas de trabajo por organización"
      ],
      "Import a job template from ERB": [
        "Importar una plantilla de trabajo desde ERB"
      ],
      "Template ERB": [
        "Plantilla ERB"
      ],
      "Overwrite template if it already exists": [
        "Sobrescribir plantilla si ya existe"
      ],
      "Export a job template to ERB": [
        "Exportar una plantilla de trabajo desde ERB"
      ],
      "Show job template details": [
        "Mostrar detalles de la plantilla de trabajo"
      ],
      "Template name": [
        "nombre de plantilla"
      ],
      "Job category": [
        "Categoría de trabajo"
      ],
      "This template is used to generate the description. Input values can be used using the syntax %{package}. You may also include the job category and template name using %{job_category} and %{template_name}.": [
        "Esta plantilla se utiliza para generar la descripción. Los valores de entrada se pueden utilizar con la sintaxis %{package}. También puede incluir la categoría de trabajo y el nombre de la plantilla con %{job_category} y %{template_name}."
      ],
      "Provider type": [
        "Tipo de proveedor"
      ],
      "Whether or not the template is locked for editing": [
        "Si la plantilla está bloqueada o no para edición"
      ],
      "Effective user options": [
        "Opciones de usuario efectivo"
      ],
      "What user should be used to run the script (using sudo-like mechanisms)": [
        "El usuario que se debe utilizar para ejecutar el script (con mecanismos tipo sudo)"
      ],
      "Whether it should be allowed to override the effective user from the invocation form.": [
        "Si debe tener permiso para sustituir el usuario efectivo del formulario de invocación."
      ],
      "Whether the current user login should be used as the effective user": [
        "Si el inicio de sesión del usuario actual se debe utilizar como usuario efectivo"
      ],
      "Create a job template": [
        "Crear una plantilla de trabajo"
      ],
      "Update a job template": [
        "Actualizar una plantilla de trabajo"
      ],
      "Template version": [
        "versión de plantilla"
      ],
      "Delete a job template": [
        "Eliminar una plantilla de trabajo"
      ],
      "Clone a provision template": [
        "Clonar una plantilla de aprovisionamiento"
      ],
      "List remote execution features": [
        "Listar funcionalidades de ejecución remota"
      ],
      "Show remote execution feature": [
        "Mostrar funcionalidad de ejecución remota"
      ],
      "Job template ID to be used for the feature": [
        "ID de la plantilla de trabajo que se debe utilizar para la funcionalidad"
      ],
      "List available remote execution features for a host": [
        ""
      ],
      "List template invocations belonging to job invocation": [
        "Enumerar las invocaciones de la plantilla que pertenecen a la invocación del trabajo"
      ],
      "Identifier of the Host interface for Remote execution": [
        "Identificador de la interfaz del host para la ejecución remota"
      ],
      "Set 'host_registration_remote_execution_pull' parameter for the host. If it is set to true, pull provider client will be deployed on the host": [
        ""
      ],
      "List of proxy IDs to be used for remote execution": [
        "Lista de ID de proxy que se utilizarán para la ejecución remota"
      ],
      "Trying to abort the job": [
        "Intentando abortar el trabajo"
      ],
      "Trying to cancel the job": [
        "Intentando cancelar el trabajo"
      ],
      "The job cannot be aborted at the moment.": [
        "No es posible abortar el trabajo en este momento."
      ],
      "The job cannot be cancelled at the moment.": [
        "No es posible cancelar el trabajo en este momento."
      ],
      "Problem with previewing the template: %{error}. Note that you must save template input changes before you try to preview it.": [
        "Ha ocurrido un problema al hacer una vista previa de la plantilla: %{error}. Tenga en cuenta que debe guardar los cambios de la entrada de la plantilla antes de intentar obtener una vista previa."
      ],
      "Job template imported successfully.": [
        "Se importó correctamente una plantilla de trabajo"
      ],
      "Unable to save template. Correct highlighted errors": [
        "No se puede guardar plantilla. Corrija los errores resaltados."
      ],
      "Run": [
        "Ejecutar"
      ],
      "Schedule Remote Job": [
        "Programar trabajo remoto"
      ],
      "Jobs": [
        "Trabajos"
      ],
      "Job invocations": [
        "Invocaciones de trabajo"
      ],
      "%s": [
        "%s"
      ],
      "Web Console": [
        "Consola web"
      ],
      "Success": [
        "Éxito"
      ],
      "Failed": [
        "Errores"
      ],
      "Pending": [
        "Pendiente"
      ],
      "Cancelled": [
        "Cancelado"
      ],
      "queued to start executing in %{time}": [
        "en cola para comenzar a ejecutarse en %{time}"
      ],
      "queued": [
        "en cola"
      ],
      "running %{percent}%%": [
        "corriendo %{percent}%%"
      ],
      "succeeded": [
        "exitoso"
      ],
      "cancelled": [
        "Cancelado"
      ],
      "failed": [
        "fallido"
      ],
      "unknown status": [
        "estado desconocido"
      ],
      "Any Organization": [
        "Cualquier organización"
      ],
      "Any Location": [
        "Cualquier Lugar"
      ],
      "error": [
        "error"
      ],
      "Host detail": [
        "Detalle del host"
      ],
      "Rerun on %s": [
        "Volver a ejecutar en %s"
      ],
      "Host task": [
        "Tarea del host"
      ],
      "N/A": [
        "N/C"
      ],
      "Run Job": [
        "Ejecutar trabajo"
      ],
      "Create Report": [
        "Crear informe"
      ],
      "Create report for this job": [
        "Crear informe para este trabajo"
      ],
      "Rerun": [
        "Volver a ejecutar"
      ],
      "Rerun the job": [
        "Volver a ejecutar el trabajo"
      ],
      "Rerun failed": [
        "Error al volver a ejecutar"
      ],
      "Rerun on failed hosts": [
        "Volver a ejecutar en hosts con error"
      ],
      "Job Task": [
        "Tarea del trabajo"
      ],
      "See the last task details": [
        "Visualizar los detalles de la última tarea"
      ],
      "Cancel Job": [
        "Cancelar tarea"
      ],
      "Try to cancel the job": [
        "Intentar cancelar el trabajo"
      ],
      "Abort Job": [
        "Abortar trabajo"
      ],
      "Try to abort the job without waiting for the results from the remote hosts": [
        "Intentar abortar el trabajo sin esperar los resultados de hosts remotos"
      ],
      "New UI": [
        ""
      ],
      "Switch to the new job invocation detail UI": [
        ""
      ],
      "Task Details": [
        "Detalles de tareas"
      ],
      "See the task details": [
        "Ver los detalles de la tarea"
      ],
      "Try to cancel the job on a host": [
        "Intentar cancelar el trabajo en un host"
      ],
      "Try to abort the job on a host without waiting for its result": [
        "Intentar abortar el trabajo en un host sin esperar el resultado"
      ],
      "Could not render the preview because no host matches the search query.": [
        "No se pudo mostrar la vista previa porque no hay ningún host que coincida con la consulta de búsqueda."
      ],
      "in %s": [
        "en %s"
      ],
      "%s ago": [
        "Hace %s"
      ],
      "Use default description template": [
        "Utilizar plantilla de descripción predeterminada"
      ],
      "Description template": [
        "Plantilla de descripción"
      ],
      "This template is used to generate the description.<br/>Input values can be used using the syntax %{package}.<br/>You may also include the job category and template<br/>name using %{job_category} and %{template_name}.": [
        "Esta plantilla se utiliza para generar la descripción.<br/>Los valores de entrada pueden utilizarse utilizando la sintaxis %{package}.<br/>También puede incluir la categoría de trabajo y el nombre de la plantilla<br/>utilizando %{job_category} y %{template_name}."
      ],
      "Could not use any template used in the job invocation": [
        "No se pudo utilizar ninguna plantilla utilizada en la invocación de trabajo."
      ],
      "Failed rendering template: %s": [
        "Falló la reproducción de la plantilla: %s."
      ],
      "Task cancelled": [
        "Tarea cancelada"
      ],
      "Job execution failed": [
        "Ocurrió un error en la ejecución del trabajo"
      ],
      "%{description} on %{host}": [
        "%{description} en %{host}"
      ],
      "Remote action:": [
        "Acción remota:"
      ],
      "Job cancelled by user": [
        "Trabajo cancelado por el usuario"
      ],
      "Exit status: %s": [
        "Estado de salida: %s"
      ],
      "Job finished with error": [
        "El trabajo finalizó con error."
      ],
      "Error loading data from proxy": [
        "Error al cargar los datos del proxy"
      ],
      "User can not execute job on host %s": [
        "El usuario no puede ejecutar el trabajo en el host %s."
      ],
      "User can not execute this job template": [
        "El usuario no puede ejecutar esta plantilla de trabajo."
      ],
      "User can not execute job on infrastructure host %s": [
        "El usuario no puede ejecutar el trabajo en el host de infraestructura %s"
      ],
      "User can not execute this job template on %s": [
        "El usuario no puede ejecutar esta plantilla de trabajo en %s."
      ],
      "The only applicable proxy %{proxy_names} is down": [
        "El único proxy aplicable %{proxy_names} está inactivo.",
        "Todos los proxies aplicables %{count} están inactivos. Se intentó %{proxy_names}",
        "Todos los proxies aplicables %{count} están inactivos. Se intentó %{proxy_names}"
      ],
      "Could not use any proxy for the %{provider} job. Consider configuring %{global_proxy}, %{fallback_proxy} in settings": [
        "No se ha podido utilizar ningún proxy para el trabajo %{provider}. Considere configurar %{global_proxy}, %{fallback_proxy} en ajustes."
      ],
      "REX job has succeeded - %s": [
        "El trabajo REX ha tenido éxito - %s"
      ],
      "REX job has failed - %s": [
        "El trabajo REX ha fallado - %s"
      ],
      "included template '%s' not found": [
        "no se encontró la plantilla incluida '%s'."
      ],
      "input macro with name '%s' used, but no input with such name defined for this template": [
        "macro de entrada con nombre '%s' en uso, pero ninguna entrada con ese nombre definida para esta plantilla"
      ],
      "Unable to fetch public key": [
        "No se pudo extraer la llave pública."
      ],
      "Unable to remove host from known hosts": [
        "No se puede eliminar el host de los hosts conocidos"
      ],
      "REX job has finished - %s": [
        "El trabajo REX ha terminado - %s"
      ],
      "Should this interface be used for remote execution?": [
        "¿Debe utilizarse esta interfaz para la ejecución remota?"
      ],
      "Interface with the '%s' identifier was specified as a remote execution interface, however the interface was not found on the host. If the interface exists, it needs to be created in Foreman during the registration.": [
        "Se ha especificado una interfaz con el identificador '%s' como interfaz de ejecución remota, pero la interfaz no se ha encontrado en el host. Si la interfaz existe, es necesario crearla en Foreman durante el registro."
      ],
      "host already has an execution interface": [
        "el host ya tiene una interfaz de ejecución."
      ],
      "This template is locked. Please clone it to a new template to customize.": [
        "La plantilla está bloqueada. Cópiela en una nueva para personalizarla."
      ],
      "Circular dependency detected in foreign input set '%{template}' -> '%{target_template}'. Templates stack: %{templates_stack}": [
        "Dependencia circular detectada en el conjunto de entrada externo '%{template}' -> '%{target_template}'. Pila de plantillas: %{templates_stack}"
      ],
      "Execution": [
        "Ejecución"
      ],
      "Last execution succeeded": [
        "La última ejecución se realizó correctamente."
      ],
      "No execution finished yet": [
        "Aún no finalizó ninguna ejecución."
      ],
      "Last execution cancelled": [
        "Se canceló la última ejecución"
      ],
      "Last execution failed": [
        "Falló la última ejecución."
      ],
      "Unknown execution status": [
        "Estado de ejecución desconocido"
      ],
      "Recursive rendering of templates detected": [
        "Se detectó una reproducción recursiva de plantillas."
      ],
      "error during rendering: %s": [
        "error durante la reproducción: %s"
      ],
      "template": [
        "Plantilla"
      ],
      "Cannot specify both bookmark_id and search_query": [
        "No se pueden especificar bookmark_id y search_query."
      ],
      "Unknown input %{input_name} for template %{template_name}": [
        "Entrada desconocida %{input_name} para plantilla %{template_name}"
      ],
      "Template with id '%{id}' was not found": [
        "No se encontró la plantilla con ID '%{id}'."
      ],
      "Feature input %{input_name} not defined in template %{template_name}": [
        "Feature input %{input_name} not defined in template % (Entrada de características % no definida en la plantilla %){template_name}"
      ],
      "No template mapped to feature %{feature_name}": [
        "No hay ninguna plantilla mapeada a la funcionalidad %{feature_name}."
      ],
      "The template %{template_name} mapped to feature %{feature_name} is not accessible by the user": [
        "El usuario no puede acceder a la plantilla %{template_name} mapeada a la funcionalidad %{feature_name}."
      ],
      "Job Invocation": [
        "Invocación de trabajo"
      ],
      "Duplicated inputs detected: %{duplicated_inputs}": [
        "Entradas duplicadas detectadas: %{duplicated_inputs}"
      ],
      "Unknown remote execution feature %s": [
        "Funcionalidad de ejecución remota desconocida %s"
      ],
      "Effective user method \\\"%{current_value}\\\" is not one of %{valid_methods}": [
        "Método de usuario eficaz \\\"%{current_value}\\\" no es uno de %.{valid_methods}"
      ],
      "Could not find any suitable interface for execution": [
        "No se pudo hallar una interfaz adecuada para la ejecución"
      ],
      "Subscribe to my failed jobs": [
        "Suscríbase a mis trabajos fallidos"
      ],
      "Subscribe to my succeeded jobs": [
        "Suscríbase a mis trabajos con éxito"
      ],
      "Subscribe to all my jobs": [
        "Suscribirse a todos mis trabajos"
      ],
      "Script": [
        "Guión"
      ],
      "Static Query": [
        "Consulta estática"
      ],
      "Dynamic Query": [
        "Consulta dinámica"
      ],
      "Alphabetical": [
        "Alfabético"
      ],
      "Randomized": [
        "Aleatorio"
      ],
      "Cannot resolve hosts without a user": [
        "No se pueden determinar los hosts sin un usuario."
      ],
      "Cannot resolve hosts without a bookmark or search query": [
        "No se pueden determinar los hosts sin un marcador o una consulta de búsqueda."
      ],
      "Must select a bookmark or enter a search query": [
        "Se debe seleccionar un marcador o ingresar una consulta de búsqueda."
      ],
      "Input": [
        "Entrada"
      ],
      "Not all required inputs have values. Missing inputs: %s": [
        "No todas las entradas requeridas tienen valores. Entradas que faltan: %s"
      ],
      "Internal proxy selector can only be used if Katello is enabled": [
        "El selector de proxy interno sólo se puede utilizar si Katello está activado"
      ],
      "default_capsule method missing from SmartProxy": [
        "Falta el método default_capsule en SmartProxy"
      ],
      "Can't find Job Invocation for an id %s": [
        "No se puede encontrar la Invocación de Empleo para un id %s"
      ],
      "Latest Jobs": [
        "Últimos empleos"
      ],
      "Name": [
        "Nombre"
      ],
      "State": [
        "Estado"
      ],
      "Started": [
        "Inició"
      ],
      "No jobs available": [
        "No hay empleos disponibles"
      ],
      "Results": [
        "Resultados"
      ],
      "Schedule": [
        "Programa"
      ],
      "Concurrency level limited to": [
        "Nivel de concurrencia limitado a"
      ],
      "tasks at a time": [
        "tareas a la vez"
      ],
      "Scheduled to start before": [
        "Programado para iniciar antes"
      ],
      "Scheduled to start at": [
        "Programado para comenzar a las"
      ],
      "Timeout to kill after": [
        "Tiempo de expiración para eliminar después de"
      ],
      "seconds": [
        "segundos"
      ],
      "Time to pickup": [
        ""
      ],
      "Target hosts": [
        "Hosts de destino"
      ],
      "Bookmark": [
        "Marcador"
      ],
      "Manual selection": [
        "Selección manual"
      ],
      "using ": [
        "mediante"
      ],
      "Execution order": [
        "Orden de ejecución"
      ],
      "Organization": [
        "Organización"
      ],
      "Location": [
        "Ubicación"
      ],
      "SSH User": [
        "Usuario de SSH"
      ],
      "Evaluated at:": [
        "Evaluado en:"
      ],
      "User Inputs": [
        "Entradas del usuario"
      ],
      "Description": [
        "Descripción"
      ],
      "Job template": [
        "Plantilla de trabajo"
      ],
      "Resolves to": [
        "Se resuelve en"
      ],
      "hosts": [
        "Hosts"
      ],
      "Refresh": [
        "Actualizar"
      ],
      "Preview": [
        "Previsualizar"
      ],
      "Display advanced fields": [
        "Mostrar campos avanzados"
      ],
      "Hide advanced fields": [
        "Ocultar campos avanzados"
      ],
      "SSH user": [
        ""
      ],
      "A user to be used for SSH.": [
        ""
      ],
      "Effective user": [
        "Usuario efectivo"
      ],
      "A user to be used for executing the script. If it differs from the SSH user, su or sudo is used to switch the accounts.": [
        "Un usuario que se debe utilizar para ejecutar el script. Si es distinto del usuario SSH, se utiliza su o sudo para cambiar las cuentas."
      ],
      "Timeout to kill": [
        "Tiempo de expiración restante"
      ],
      "Time in seconds from the start on the remote host after which the job should be killed.": [
        "Tiempo en segundos desde el comienzo en el host remoto tras lo cual debe eliminarse el trabajo."
      ],
      "Interval in seconds, if the job is not picked up by a client within this interval it will be cancelled.": [
        ""
      ],
      "Password": [
        "Contraseña"
      ],
      "Password is stored encrypted in DB until the job finishes. For future or recurring executions, it is removed after the last execution.": [
        "La contraseña se guarda de forma cifrada en la base de datos hasta que finaliza el trabajo. Para ejecuciones futuras o recurrentes, se elimina tras la última ejecución."
      ],
      "Private key passphrase": [
        "Frase de contraseña de clave privada"
      ],
      "Key passhprase is only applicable for SSH provider. Other providers ignore this field. <br> Passphrase is stored encrypted in DB until the job finishes. For future or recurring executions, it is removed after the last execution.": [
        "La frase de contraseña de la clave solo se aplica para el proveedor de SSH. Otros proveedores ignoran este campo. <br> La frase de contraseña se guarda de forma cifrada en la base de datos hasta que finaliza el trabajo. Para ejecuciones futuras o recurrentes, se elimina tras la última ejecución."
      ],
      "Effective user password": [
        "Contraseña de usuario efectiva"
      ],
      "Effective user password is only applicable for SSH provider. Other providers ignore this field. <br> Password is stored encrypted in DB until the job finishes. For future or recurring executions, it is removed after the last execution.": [
        "La contraseña de usuario efectiva sólo es aplicable al proveedor SSH. Otros proveedores ignoran este campo. <br> La contraseña se almacena encriptada en la base de datos hasta que finaliza el trabajo. Para ejecuciones futuras o recurrentes, se elimina después de la última ejecución."
      ],
      "Concurrency level": [
        "Nivel de concurrencia"
      ],
      "Run at most N tasks at a time. If this is set and proxy batch triggering is enabled, then tasks are triggered on the smart proxy in batches of size 1.": [
        "Ejecutar como mucho N tareas a la vez. Si esto está configurado y se habilita la activación por lotes del proxy, entonces las tareas se activarán en el proxy inteligente en lotes de tamaño 1."
      ],
      "Execution ordering": [
        "Orden de ejecución"
      ],
      "Execution ordering determines whether the jobs should be executed on hosts in alphabetical order or in randomized order.<br><ul><li><b>Ordered</b> - executes the jobs on hosts in alphabetical order</li><li><b>Randomized</b> - randomizes the order in which jobs are executed on hosts</li></ul>": [
        "El orden de ejecución determina si las tareas deben ejecutarse en los hosts en orden alfabético o en orden aleatorio.<br><ul><li><b> Ordenado</b>: ejecuta las tareas en los hosts en orden alfabético</li><li><b>Aleatorio</b>: aleatoriza el orden en que las tareas se ejecutan en los hosts</li></ul>"
      ],
      "Type of query": [
        "Tipo de consulta"
      ],
      "Type has impact on when is the query evaluated to hosts.<br><ul><li><b>Static</b> - evaluates just after you submit this form</li><li><b>Dynamic</b> - evaluates just before the execution is started, so if it's planned in future, targeted hosts set may change before it</li></ul>": [
        ""
      ],
      "The final host list may change because the selected query is dynamic.  It will be rerun during execution.": [
        "La lista de host final puede cambiar porque la consulta seleccionada es dinámica. Se volverá a ejecutar durante la ejecución."
      ],
      "...and %{count} more": [
        "",
        ""
      ],
      "No hosts found.": [
        "No se encontraron hosts."
      ],
      "Close": [
        "Cerrar"
      ],
      "Current organization %{org_c} is different from job's organization %{org_j}.": [
        "La organización actual %{org_c} es diferente de la organización de la tarea %{org_j}."
      ],
      "Current location %{loc_c} is different from job's location %{loc_j}.": [
        "La ubicación actual %{loc_c} es diferente de la ubicación de la tarea %{loc_j}."
      ],
      "The dynamic query '%{query}' was not resolved yet. The list of hosts to which it would resolve now can be seen %{here}.": [
        "La consulta dinámica '%{query}' aún no se resolvió. La lista de hosts en los que se resolverá ahora se puede ver %{here}."
      ],
      "here": [
        "aquí"
      ],
      "effective user": [
        "usuario efectivo"
      ],
      "Total hosts": [
        "Total hosts"
      ],
      "Hosts gone missing": [
        "Anfitriones desaparecidos"
      ],
      "This can happen if the host is removed or moved to another organization or location after the job was started": [
        "Esto puede ocurrir si el host se elimina o se traslada a otra organización o ubicación después de iniciar el trabajo."
      ],
      "Providers and templates": [
        "Proveedores y plantillas"
      ],
      "User input": [
        "Entrada de usuario"
      ],
      "Value": [
        "Valor"
      ],
      "Search Query": [
        "Consulta de búsqueda"
      ],
      "Status": [
        "Estado"
      ],
      "Succeeded": [
        "exitoso"
      ],
      "Start": [
        "Iniciar"
      ],
      "Job invocation": [
        "Invocación de trabajo"
      ],
      "Use new job wizard": [
        ""
      ],
      "Overview": [
        "Sinopsis"
      ],
      "Preview templates": [
        "Vista previa de las plantillas"
      ],
      "Recurring logic": [
        "Lógica recurrente"
      ],
      "Job Invocations": [
        "Invocaciones de trabajo"
      ],
      "Foreman can run arbitrary commands on remote hosts using different providers, such as SSH or Ansible. Communication goes through the Smart Proxy so Foreman does not have to have direct access to the target hosts and can scale to control many hosts.": [
        "Foreman puede ejecutar comandos arbitrarios en hosts remotos mediante diferentes proveedores, como SSH o Ansible. La comunicación pasa por el proxy inteligente para que Foreman no tenga que tener acceso directo con los hosts de destino y pueda escalarse para controlar varios hosts."
      ],
      "Learn more about this in the documentation.": [
        "Consulte la documentación para obtener más información."
      ],
      "Job": [
        "Tarea"
      ],
      "Type": [
        "Tipo"
      ],
      "Add Foreign Input Set": [
        "Agregar conjunto de entrada externo"
      ],
      "add an input set for this template to reference a different template inputs": [
        "agregar un conjunto de entrada para esta plantilla para hacer referencia a entradas de una plantilla diferente"
      ],
      "Snippet": [
        "Snippet"
      ],
      "Select an ERB file to upload in order to import a job template.  The template must contain metadata in the first ERB comment.": [
        "Seleccione un archivo ERB a cargar con el fin de importar una plantilla de trabajo. La plantilla debe contener metadatos en el primer comentario ERB."
      ],
      "Overwrite": [
        "Sobrescribir"
      ],
      "Whether to overwrite the template if it already exists": [
        "Sobrescribir o no la plantilla si ya existe"
      ],
      "Job Templates": [
        "Plantillas de trabajo"
      ],
      "Edit %s": [
        "Editar %s"
      ],
      "Edit Job Template": [
        "Editar plantilla de trabajo"
      ],
      "Import": [
        "Importar"
      ],
      "New Job Template": [
        "Nueva plantilla de trabajo"
      ],
      "JobTemplate|Name": [
        "Plantilla de trabajo|Nombre"
      ],
      "JobTemplate|Snippet": [
        "Plantilla de trabajo|Snippet"
      ],
      "JobTemplate|Locked": [
        "Plantilla de trabajo|Bloqueada"
      ],
      "Actions": [
        "Acciones"
      ],
      "This template is locked for editing.": [
        "La edición de la plantilla está bloqueada."
      ],
      "The execution interface is used for remote execution": [
        "La interfaz de ejecución se utiliza para la ejecución remota."
      ],
      "Remote execution": [
        "Ejecución remota"
      ],
      "Remote Execution": [
        "Ejecución remota"
      ],
      "Proxies": [
        "Proxis"
      ],
      "Select as many remote execution proxies as applicable for this subnet.  When multiple proxies with the same provider are added, actions will be load balanced among them.": [
        "Seleccione tantos proxy de ejecución remota como se puedan aplicar a esta subred. Cuando se añaden múltiples proxy con el mismo proveedor, las acciones se cargarán de manera equilibrada entre ellos."
      ],
      "You are not allowed to see the currently assigned template. Saving the form now would unassign the template.": [
        "No puede ver la plantilla actualmente asignada. Si guarda el formulario ahora, se eliminará la asignación de la plantilla."
      ],
      "Remote Execution Features": [
        "Funcionalidades de ejecución remota"
      ],
      "Label": [
        "Etiqueta"
      ],
      "Edit Remote Execution Feature": [
        "Editar la funcionalidad de ejecución remota"
      ],
      "A job '%{job_name}' has %{status} at %{time}": [
        "Un trabajo '%{job_name}' tiene %{status} en %{time}"
      ],
      "Job result": [
        "Resultado del trabajo"
      ],
      "Failed hosts": [
        "Anfitriones fallidos"
      ],
      "See more details at %s": [
        "Más información en %s"
      ],
      "Foreign input set": [
        "Conjunto de entrada externo"
      ],
      "remove template input set": [
        "eliminar el conjunto de entrada de la plantilla"
      ],
      "A comma separated list of input names to be excluded from the foreign template.": [
        "Una lista de nombres de entrada separados por comas que se debe excluir de la plantilla externa."
      ],
      "Template Invocation for %s": [
        "Invocación de plantilla para %s"
      ],
      "Back to Job": [
        "Volver al trabajo"
      ],
      "Toggle command": [
        "Alternar comando"
      ],
      "Toggle STDERR": [
        "Alternar STDERR"
      ],
      "Toggle STDOUT": [
        "Alternar STDOUT"
      ],
      "Toggle DEBUG": [
        "Alternar DEBUG"
      ],
      "Target: ": [
        "Destino: "
      ],
      "using Smart Proxy": [
        "utilizando Smart Proxy"
      ],
      "Scroll to bottom": [
        "Desplazarse hasta el final"
      ],
      "Scroll to top": [
        "Desplazarse hasta la parte superior"
      ],
      "Could not display data for job invocation.": [
        "No se han podido mostrar los datos para la invocación del trabajo."
      ],
      "Unsupported or no operating system found for this host.": [
        "El sistema operativo no se admite o no se encuentra para este host."
      ],
      "A job '%{subject}' has finished successfully": [
        "El trabajo '%{subject}' ha finalizado correctamente"
      ],
      "Job Details": [
        "Detalles de la tarea"
      ],
      "A job '%{subject}' has failed": [
        "Un trabajo '%{subject}' ha fallado"
      ],
      "Remote execution job": [
        "Trabajo de ejecución remota"
      ],
      "A notification when a job finishes": [
        "Una notificación cuando finaliza un trabajo"
      ],
      "Unable to create mail notification: %s": [
        "No se puede crear una notificación de correo: %s"
      ],
      "Search the host for any proxy with Remote Execution, useful when the host has no subnet or the subnet does not have an execution proxy": [
        "Busque en el host algún proxy con Ejecución remota, útil cuando el host no tiene subred o cuando la subred no tiene un proxy de ejecución."
      ],
      "Fallback to Any Proxy": [
        "Acción de reserva en cualquier proxy"
      ],
      "Search for remote execution proxy outside of the proxies assigned to the host. The search will be limited to the host's organization and location.": [
        "Busque un proxy de ejecución remota fuera de los proxies asignados al host. La búsqueda se limitará a la organización y ubicación del host."
      ],
      "Enable Global Proxy": [
        "Activar proxy global"
      ],
      "Default user to use for SSH.  You may override per host by setting a parameter called remote_execution_ssh_user.": [
        "Usuario predeterminado que se debe utilizar para SSH. Puede sustituir por host al establecer un parámetro llamado remote_execution_ssh_user."
      ],
      "Default user to use for executing the script. If the user differs from the SSH user, su or sudo is used to switch the user.": [
        "Usuario predeterminado que se debe utilizar para ejecutar el script. Si el usuario es distinto del usuario de SSH, su o sudo se utiliza para cambiar el usuario."
      ],
      "Effective User": [
        "Usuario efectivo"
      ],
      "What command should be used to switch to the effective user. One of %s": [
        "El comando que se debe utilizar para cambiar el usuario efectivo. Uno de %s"
      ],
      "Effective User Method": [
        "Método de usuario efectivo"
      ],
      "Whether we should sync templates from disk when running db:seed.": [
        "Si debemos sincronizar las plantillas del disco al ejecutar db:seed."
      ],
      "Sync Job Templates": [
        "Sincronizar plantillas de trabajo"
      ],
      "Port to use for SSH communication. Default port 22. You may override per host by setting a parameter called remote_execution_ssh_port.": [
        "Puerto para usar para la comunicación SSH. Puerto predeterminado: 22. Puede sustituir por host al establecer un parámetro llamado remote_execution_ssh_port."
      ],
      "SSH Port": [
        "Puerto SSH"
      ],
      "Should the ip addresses on host interfaces be preferred over the fqdn? It is useful when DNS not resolving the fqdns properly. You may override this per host by setting a parameter called remote_execution_connect_by_ip. For dual-stacked hosts you should consider the remote_execution_connect_by_ip_prefer_ipv6 setting": [
        "¿Se deben preferir las direcciones ip de las interfaces del host sobre el fqdn? Es útil cuando DNS no resuelve el fqdns correctamente. Puede anular esto por host estableciendo un parámetro llamado remote_execution_connect_by_ip. Para hosts dual-stacked deberías considerar el parámetro remote_execution_connect_by_ip_prefer_ipv6."
      ],
      "Connect by IP": [
        "Conectar por IP"
      ],
      "When connecting using ip address, should the IPv6 addresses be preferred? If no IPv6 address is set, it falls back to IPv4 automatically. You may override this per host by setting a parameter called remote_execution_connect_by_ip_prefer_ipv6. By default and for compatibility, IPv4 will be preferred over IPv6 by default": [
        "Al conectarse mediante dirección ip, ¿se debe dar preferencia a las direcciones IPv6? Si no se establece ninguna dirección IPv6, se pasa automáticamente a IPv4. Puede anular esto por host estableciendo un parámetro llamado remote_execution_connect_by_ip_prefer_ipv6. Por defecto y por compatibilidad, IPv4 será preferido sobre IPv6 por defecto."
      ],
      "Prefer IPv6 over IPv4": [
        "Preferir IPv6 a IPv4"
      ],
      "Default password to use for SSH. You may override per host by setting a parameter called remote_execution_ssh_password": [
        "Contraseña predeterminada que se debe utilizar para SSH. Puede sustituir por host al establecer un parámetro llamado remote_execution_ssh_password"
      ],
      "Default SSH password": [
        "Contraseña predeterminada de SSH"
      ],
      "Default key passphrase to use for SSH. You may override per host by setting a parameter called remote_execution_ssh_key_passphrase": [
        "Frase de contraseña predeterminada que se debe utilizar para SSH. Puede sustituir por host al establecer un parámetro llamado remote_execution_ssh_key_passphrase"
      ],
      "Default SSH key passphrase": [
        "Frase de contraseña de clave SSH predeterminada"
      ],
      "Amount of workers in the pool to handle the execution of the remote execution jobs. Restart of the dynflowd/foreman-tasks service is required.": [
        "Cantidad de trabajadores en el grupo para manejar la ejecución de tareas de ejecución remota. Se requiere el reinicio del servicio dynflowd/foreman-tasks."
      ],
      "Workers pool size": [
        "Tamaño del grupo de trabajadores"
      ],
      "When enabled, working directories will be removed after task completion. You may override this per host by setting a parameter called remote_execution_cleanup_working_dirs.": [
        "Cuando se habilita, los directorios en ejecución se eliminarán después de que se complete la tarea. Puede sobrescribirlo por host al definir un parámetro denominado remote_execution_cleanup_working_dirs."
      ],
      "Cleanup working directories": [
        "Directorios de limpieza en ejecución"
      ],
      "Where to find the Cockpit instance for the Web Console button.  By default, no button is shown.": [
        "Dónde encontrar la instancia de Cockpit para el botón de la consola web. Por defecto, no se muestra ningún botón."
      ],
      "Cockpit URL": [
        "URL de Cockpit"
      ],
      "Choose a job template that is pre-selected in job invocation form": [
        "Elija una plantilla de tarea que esté preseleccionada en el formulario de invocación de tarea"
      ],
      "Form Job Template": [
        "Nueva plantilla de tarea"
      ],
      "Select a report template used for generating a report for a particular remote execution job": [
        "Seleccione una plantilla de informe utilizada para generar un informe para un determinado trabajo de ejecución remota"
      ],
      "Job Invocation Report Template": [
        "Plantilla de informe de convocatoria de empleo"
      ],
      "Time in seconds within which the host has to pick up a job. If the job is not picked up within this limit, the job will be cancelled. Defaults to 1 day. Applies only to pull-mqtt based jobs.": [
        ""
      ],
      "Job templates": [
        "Plantillas de trabajo"
      ],
      "Job invocations detail": [
        ""
      ],
      "Run Puppet Once": [
        "Ejecutar Puppet una vez"
      ],
      "Perform a single Puppet run": [
        "Realizar una sola ejecución de Puppet"
      ],
      "Run Script": [
        ""
      ],
      "Run a script": [
        ""
      ],
      "Not yet": [
        ""
      ],
      "Effective user:": [
        ""
      ],
      "Started at:": [
        ""
      ],
      "SSH user:": [
        ""
      ],
      "Template:": [
        ""
      ],
      "Submit": [
        ""
      ],
      "Next": [
        ""
      ],
      "Back": [
        ""
      ],
      "Start job": [
        ""
      ],
      "Fill all required fields in all the steps": [
        ""
      ],
      "Run on selected hosts": [
        ""
      ],
      "Skip to review step": [
        ""
      ],
      "Fill all required fields in all the steps to start the job": [
        ""
      ],
      "Skip to review": [
        ""
      ],
      "Cancel": [
        ""
      ],
      "Does not repeat": [
        "No se repite"
      ],
      "Cronline": [
        "Cronline"
      ],
      "Monthly": [
        "Mensual"
      ],
      "Weekly": [
        "Semanalmente"
      ],
      "Daily": [
        "Diariamente"
      ],
      "Hourly": [
        "Por hora"
      ],
      "Immediate execution": [
        ""
      ],
      "Future execution": [
        ""
      ],
      "Recurring execution": [
        ""
      ],
      "Category and template": [
        ""
      ],
      "Target hosts and inputs": [
        "Anfitriones objetivo y entradas"
      ],
      "Advanced fields": [
        "Campos avanzados"
      ],
      "Review details": [
        "Detalles de la revisión"
      ],
      "Type of execution": [
        ""
      ],
      "Hosts": [
        "Hosts"
      ],
      "Host collections": [
        "Colecciones de acogida"
      ],
      "Host groups": [
        "Grupo del host"
      ],
      "Search query": [
        "Consulta de búsqueda"
      ],
      "Run job": [
        "Ejecutar trabajo"
      ],
      "Use old form": [
        ""
      ],
      "Current organization %s is different from job's organization %s. This job may run on different hosts than before.": [
        ""
      ],
      "Current location %s is different from job's location %s. This job may run on different hosts than before.": [
        ""
      ],
      "'Starts before' date must in the future": [
        ""
      ],
      "Please go back to \\\\\\\"Schedule\\\\\\\" - \\\\\\\"Future execution\\\\\\\" step to fix the error": [
        ""
      ],
      "Use legacy form": [
        ""
      ],
      "Edit job description template": [
        "Editar plantilla de descripción de funciones"
      ],
      "Preview job description": [
        "Vista previa de la descripción del puesto"
      ],
      "For example: 1, 2, 3, 4, 5...": [
        "Por ejemplo: 1, 2, 3, 4, 5..."
      ],
      "Interval in seconds, if the job is not picked up by a client within this interval it will be cancelled. Applies only to pull-mqtt based jobs": [
        ""
      ],
      "Key passphrase is only applicable for SSH provider. Other providers ignore this field. Passphrase is stored encrypted in DB until the job finishes. For future or recurring executions, it is removed after the last execution.": [
        "La frase de contraseña sólo es aplicable al proveedor SSH. Otros proveedores ignoran este campo. La frase de contraseña se almacena cifrada en la base de datos hasta que finaliza el trabajo. Para ejecuciones futuras o recurrentes, se elimina después de la última ejecución."
      ],
      "Effective user password is only applicable for SSH provider. Other providers ignore this field. Password is stored encrypted in DB until the job finishes. For future or recurring executions, it is removed after the last execution.": [
        "La contraseña de usuario efectiva sólo es aplicable al proveedor SSH. Otros proveedores ignoran este campo. La contraseña se almacena encriptada en la base de datos hasta que finaliza el trabajo. Para ejecuciones futuras o recurrentes, se elimina después de la última ejecución."
      ],
      "All fields are required.": [
        "Todos los campos son obligatorios."
      ],
      "Error": [
        "Error"
      ],
      "Errors:": [
        "Errores:"
      ],
      "Categories list failed with:": [
        "La lista de categorías falló con:"
      ],
      "Templates list failed with:": [
        "Lista de plantillas falló con:"
      ],
      "Template failed with:": [
        "Plantilla falló con:"
      ],
      "Preview Hosts": [
        "Vista previa de los anfitriones"
      ],
      "...and %s more": [
        "...y %s más"
      ],
      "%s more": [
        ""
      ],
      "Clear all filters": [
        ""
      ],
      "There are no available input fields for the selected template.": [
        "No hay campos de entrada disponibles para la plantilla seleccionada."
      ],
      "Please select at least one host": [
        ""
      ],
      "Please enter a search query": [
        ""
      ],
      "Please select at least one host collection": [
        ""
      ],
      "Please select at least one host group": [
        ""
      ],
      "Filter by hosts": [
        "Filtrar por hosts"
      ],
      "Filter by host collections": [
        "Filtrar por colecciones de hosts"
      ],
      "Filter by host groups": [
        "Filtrar por grupos de hosts"
      ],
      "Apply to": [
        "Solicitar"
      ],
      "Never": [
        "Nunca"
      ],
      "After %s occurences": [
        ""
      ],
      "Every hour at minute %s": [
        ""
      ],
      "Every day at %s": [
        ""
      ],
      "Every week on %s at %s": [
        ""
      ],
      "Every month on %s at %s": [
        ""
      ],
      "Cron line": [
        "Línea Cron"
      ],
      "No Target Hosts": [
        "No hay hosts de destino"
      ],
      "view host names": [
        ""
      ],
      "Hide all advanced fields": [
        "Ocultar todos los campos avanzados"
      ],
      "Show all advanced fields": [
        "Mostrar todos los campos avanzados"
      ],
      "Schedule type": [
        "Tipo de horario"
      ],
      "Recurrence": [
        "Recurrencia"
      ],
      "Starts at": [
        "Comienza en"
      ],
      "Starts Before": [
        ""
      ],
      "Starts": [
        "Comienza"
      ],
      "Now": [
        ""
      ],
      "Repeats": [
        "Se repite"
      ],
      "Ends": [
        "Finales"
      ],
      "Purpose": [
        "Propósito"
      ],
      "Static query": [
        "Consulta estática"
      ],
      "Dynamic query": [
        "Consulta dinámica"
      ],
      "Description Template": [
        "Descripción Plantilla"
      ],
      "A special label for tracking a recurring job. There can be only one active job with a given purpose at a time.": [
        "Una etiqueta especial para el seguimiento de un trabajo recurrente. Sólo puede haber un trabajo activo con un propósito determinado a la vez."
      ],
      "Query type": [
        "Tipo de consulta"
      ],
      "Type has impact on when is the query evaluated to hosts.": [
        "El tipo influye en el momento en que se evalúa la consulta a los hosts."
      ],
      "evaluates just after you submit this form": [
        "se evalúa justo después de enviar este formulario"
      ],
      "evaluates just before the execution is started, so if it's planned in future, targeted hosts set may change before it": [
        ""
      ],
      "Cron line (extended)": [
        ""
      ],
      "Cron line format '1 2 3 4 5', where:": [
        ""
      ],
      "is minute (range: 0-59)": [
        "es minuto (rango: 0-59)"
      ],
      "is hour (range: 0-23)": [
        "es hora (rango: 0-23)"
      ],
      "is day of month (range: 1-31)": [
        "es día del mes (rango: 1-31)"
      ],
      "is month (range: 1-12)": [
        "es mes (rango: 1-12)"
      ],
      "is day of week (range: 0-6)": [
        "es día de la semana (rango: 0-6)"
      ],
      "The cron line supports extended cron line syntax. For details please refer to the ": [
        ""
      ],
      "documentation": [
        ""
      ],
      "At": [
        "En"
      ],
      "Invalid time format": [
        "Formato de hora no válido"
      ],
      "At minute": [
        "En el minuto"
      ],
      "range: 0-59": [
        ""
      ],
      "Create": [
        "Crear"
      ],
      "Minute can only be a number between 0-59": [
        ""
      ],
      "Days": [
        "Días"
      ],
      "Days of week": [
        "Días de la semana"
      ],
      "For Future execution a 'Starts at' date or 'Starts before' date must be selected. Immediate execution can be selected in the previous step.": [
        ""
      ],
      "'Starts before' date must be after 'Starts at' date": [
        ""
      ],
      "Clear input": [
        ""
      ],
      "Starts before": [
        "Comienza antes de"
      ],
      "End time needs to be after start time": [
        "La hora de finalización debe ser posterior a la de inicio"
      ],
      "On": [
        "Activar"
      ],
      "After": [
        ""
      ],
      "Repeat amount can only be a positive number": [
        "El importe de la repetición sólo puede ser un número positivo"
      ],
      "occurences": [
        ""
      ],
      "Select the type of execution": [
        ""
      ],
      "Execute the job now.": [
        ""
      ],
      "Execute the job later, at a scheduled time.": [
        ""
      ],
      "Execute the job on a repeating schedule.": [
        ""
      ],
      "Invalid date": [
        "Fecha no válida"
      ],
      "open-help-tooltip-button": [
        "open-help-tooltip-button"
      ],
      "Reset to default": [
        "Restablecer valores predeterminados"
      ],
      "Has to be a positive number": [
        "Tiene que ser un número positivo"
      ],
      "Please refine your search.": [
        "Afine su búsqueda."
      ],
      "You have %s results to display. Showing first %s results": [
        "Tienes %s resultados para mostrar. Mostrando primeros resultados %s "
      ],
      "Opening job invocation form": [
        ""
      ],
      "%s job has been invoked": [
        "%s se ha invocado el trabajo"
      ],
      "Schedule a job": [
        "Programar un trabajo"
      ],
      "Recent jobs": [
        "Trabajos recientes"
      ],
      "View all jobs": [
        "Ver todos los empleos"
      ],
      "View finished jobs": [
        "Ver trabajos terminados"
      ],
      "View running jobs": [
        "Ver empleos de carrera"
      ],
      "View scheduled jobs": [
        "Ver trabajos programados"
      ],
      "Finished": [
        "Finalizado"
      ],
      "Running": [
        "Ejecutando"
      ],
      "Scheduled": [
        "Programado"
      ],
      "No results found": [
        "No se han encontrado resultados"
      ],
      "Remote Execution Interface": [
        "Interfaz de ejecución remota"
      ],
      "yes": [
        "sí"
      ],
      "no": [
        "no"
      ],
      "Inherit from host parameter": [
        "Heredar del parámetro del anfitrión"
      ],
      "Yes (override)": [
        "Sí (anulación)"
      ],
      "No (override)": [
        "No (anulación)"
      ],
      "REX pull mode": [
        ""
      ],
      "Setup remote execution pull mode. If set to `Yes`, pull provider client will be deployed on the registered host. The inherited value is based on the `host_registration_remote_execution_pull` parameter. It can be inherited e.g. from host group, operating system, organization. When overridden, the selected value will be stored on host parameter level.": [
        ""
      ],
      "Host": [
        "host"
      ],
      "Active Filters:": [
        ""
      ],
      "A plugin bringing remote execution to the Foreman, completing the config management functionality with remote management functionality.": [
        "Un complemento que ofrece ejecución remota a Foreman y completa la funcionalidad de administración de la configuración con la funcionalidad de administración remota."
      ],
      "Action with sub plans": [
        "Acción con subplanes"
      ],
      "Import Puppet classes": [
        "Importar clases Puppet"
      ],
      "Import facts": [
        "Importar datos"
      ]
    }
  }
};