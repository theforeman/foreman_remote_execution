 locales['foreman_remote_execution'] = locales['foreman_remote_execution'] || {}; locales['foreman_remote_execution']['fr'] = {
  "domain": "foreman_remote_execution",
  "locale_data": {
    "foreman_remote_execution": {
      "": {
        "Project-Id-Version": "foreman_remote_execution 9.0.1",
        "Report-Msgid-Bugs-To": "",
        "PO-Revision-Date": "2016-02-15 13:54+0000",
        "Last-Translator": "Claer <transiblu@claer.hammock.fr>, 2016",
        "Language-Team": "French (http://www.transifex.com/foreman/foreman/language/fr/)",
        "MIME-Version": "1.0",
        "Content-Type": "text/plain; charset=UTF-8",
        "Content-Transfer-Encoding": "8bit",
        "Language": "fr",
        "Plural-Forms": "nplurals=3; plural=(n == 0 || n == 1) ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;",
        "lang": "fr",
        "domain": "foreman_remote_execution",
        "plural_forms": "nplurals=3; plural=(n == 0 || n == 1) ? 0 : n != 0 && n % 1000000 == 0 ? 1 : 2;"
      },
      "Another interface is already set as execution. Are you sure you want to use this one instead?": [
        "Une autre interface est déjà définie pour l'exécution distante. Êtes-vous sûrs de vouloir utiliser celle-ci à la place ?"
      ],
      "There was an error while updating the status, try refreshing the page.": [
        "Il y a eu une erreur lors de la mise à jour du statut, essayez de recharger la page."
      ],
      "List foreign input sets": [
        "Afficher les jeux de données en entrée externes"
      ],
      "Show foreign input set details": [
        "Afficher les détails du jeu de données en entrée externe"
      ],
      "Target template ID": [
        "ID de modèle cible"
      ],
      "Include all inputs from the foreign template": [
        "Inclut toutes les entrées du modèle étranger"
      ],
      "A comma separated list of input names to be included from the foreign template.": [
        "Une liste des entrées du modèle externe à inclure, séparées par des virgules."
      ],
      "Input set description": [
        "Description du jeu de données en entrée"
      ],
      "Create a foreign input set": [
        "Créer un jeu de données en entrée externe"
      ],
      "Delete a foreign input set": [
        "Supprimer un jeu de données en entrée externe"
      ],
      "Update a foreign input set": [
        "Mettre à jour un jeu de données en entrée externe"
      ],
      "List job invocations": [
        "Affiche les jobs lancés"
      ],
      "Show job invocation": [
        "Voir le lancement du job"
      ],
      "Show Job status for the hosts": [
        "Afficher l'état des jobs pour les hôtes"
      ],
      "The job template to use, parameter is required unless feature was specified": [
        "Le modèle de job à utiliser, paramètre obligatoire sauf si la fonction a été spécifiée"
      ],
      "Invocation type, one of %s": [
        "Type d'invocation, l'un des suivants %s"
      ],
      "Execute the jobs on hosts in randomized order": [
        "Exécuter les jobs sur les hôtes dans un ordre aléatoire"
      ],
      "Inputs to use": [
        "Les entrées à utiliser"
      ],
      "SSH provider specific options": [
        "Options spécifiques au fournisseur SSH"
      ],
      "What user should be used to run the script (using sudo-like mechanisms). Defaults to a template parameter or global setting.": [
        "Ce que l'utilisateur devrait utiliser pour lancer le script (comme des mécanismes sudo). La valeur par défaut est un paramètre de modèle ou un paramètre global."
      ],
      "Set password for effective user (using sudo-like mechanisms)": [
        "Définir le mot de passe pour l'utilisateur effectif (en utilisant des mécanismes similaires à ceux de Sudo)"
      ],
      "Set SSH user": [
        ""
      ],
      "Set SSH password": [
        "Définir Mot de passe SSH"
      ],
      "Set SSH key passphrase": [
        "Définir Phrase de passe de clé SSH"
      ],
      "Create a recurring job": [
        "Créer un job récurrent"
      ],
      "How often the job should occur, in the cron format": [
        "La fréquence d'exécution du job, au format cron"
      ],
      "Repeat a maximum of N times": [
        "Répéter un maximum de N fois"
      ],
      "Perform no more executions after this time": [
        "Ne pas lancer d'autres exécutions après cette date"
      ],
      "Designation of a special purpose": [
        "Désignation d’un objectif spécial"
      ],
      "Schedule the job to start at a later time": [
        "Planifier le démarrage du job à une date ultérieure"
      ],
      "Schedule the job for a future time": [
        "Planifier le job à une date ultérieure"
      ],
      "Indicates that the action should be cancelled if it cannot be started before this time.": [
        "Indique si l'action doit être annulée si elle ne peut commencer à ce moment là."
      ],
      "Control concurrency level and distribution over time": [
        "Contrôle le niveau de parallélisme et la distribution dans le temps"
      ],
      "Run at most N tasks at a time": [
        "Lance un maximum de N tâches simultanément"
      ],
      "Override the description format from the template for this invocation only": [
        "Remplacer le format de description du modèle pour ce lancement uniquement"
      ],
      "Override the timeout interval from the template for this invocation only": [
        "Remplacer l'intervalle d'expiration du modèle pour ce lancement uniquement"
      ],
      "Remote execution feature label that should be triggered, job template assigned to this feature will be used": [
        "Balise de fonctionnalité d'exécution à distance qui doit être déclenchée, le modèle de job affecté à cette fonctionnalité sera utilisé"
      ],
      "Override the global time to pickup interval for this invocation only": [
        ""
      ],
      "Create a job invocation": [
        "Créer un lancement de job"
      ],
      "Get output for a host": [
        "Récupérer la sortie standard d'un hôte"
      ],
      "Get raw output for a host": [
        "Récupérer la sortie brut d'un hôte"
      ],
      "Cancel job invocation": [
        "Annuler le lancement du job"
      ],
      "The job could not be cancelled.": [
        "Le job n'a pas pu être annulé."
      ],
      "Rerun job on failed hosts": [
        "Relancer le job sur les hôtes où il a échoué"
      ],
      "Could not rerun job %{id} because its template could not be found": [
        "Impossible de relancer le job %{id} parce que son modèle n'a pas pu être trouvé"
      ],
      "Get outputs of hosts in a job": [
        "Obtenir les sorties des hôtes dans un job"
      ],
      "Host with id '%{id}' was not found": [
        "L'ID d'hôte '%{id} ' n'a pas été trouvé"
      ],
      "Only one of feature or job_template_id can be specified": [
        "Seule une fonctionnalité ou un job_template_id ne peuvent être spécifiés"
      ],
      "List job templates": [
        "Afficher les modèles de job"
      ],
      "List job templates per location": [
        "Afficher les modèles de job par emplacement"
      ],
      "List job templates per organization": [
        "Afficher les modèles de job par organisation"
      ],
      "Import a job template from ERB": [
        "Importe un modèle de job depuis ERB"
      ],
      "Template ERB": [
        "Modèle ERB"
      ],
      "Overwrite template if it already exists": [
        "Remplace le modèle si il existe déjà"
      ],
      "Export a job template to ERB": [
        "Exporte un modèle de job vers ERB"
      ],
      "Show job template details": [
        "Voir les détails d'un modèle de job"
      ],
      "Template name": [
        "Nom de modèle"
      ],
      "Job category": [
        "Catégorie du job"
      ],
      "This template is used to generate the description. Input values can be used using the syntax %{package}. You may also include the job category and template name using %{job_category} and %{template_name}.": [
        "Ce modèle est utilisé pour générer la description. Les valeurs d'entrée peuvent être utilisées avec la syntaxe %{package}. Vous pouvez aussi inclure la catégorie du job et le nom du modèle avec %{job_category} and %{template_name}."
      ],
      "Provider type": [
        "Type de fournisseur"
      ],
      "Whether or not the template is locked for editing": [
        "Indique si le modèle peut être modifié"
      ],
      "Effective user options": [
        "Options pour l'utilisateur effectif"
      ],
      "What user should be used to run the script (using sudo-like mechanisms)": [
        "Ce que l'utilisateur devrait utiliser pour lancer le script (comme des mécanismes sudo)"
      ],
      "Whether it should be allowed to override the effective user from the invocation form.": [
        "Défini s'il est permis de remplacer l'utilisateur depuis formulaire de demande."
      ],
      "Whether the current user login should be used as the effective user": [
        "indique si l'utilisateur actuel doit être utilisé comme utilisateur effectif"
      ],
      "Create a job template": [
        "Créer un modèle de job"
      ],
      "Update a job template": [
        "Mise à jour d'un modèle de job"
      ],
      "Template version": [
        "Version de modèle"
      ],
      "Delete a job template": [
        "Supprimer un modèle de job"
      ],
      "Clone a provision template": [
        "Cloner un modèle de job"
      ],
      "List remote execution features": [
        "Affiche les capacités d'exécution distantes"
      ],
      "Show remote execution feature": [
        "Affiche la capacité d'exécution distante"
      ],
      "Job template ID to be used for the feature": [
        "l'ID du modèle de job à utiliser pour cette capacité"
      ],
      "List available remote execution features for a host": [
        ""
      ],
      "List template invocations belonging to job invocation": [
        "Lister les invocations de modèles appartenant à l'appel du job"
      ],
      "Identifier of the Host interface for Remote execution": [
        "Identifiant de l'interface de l'hôte pour l'exécution à distance"
      ],
      "Set 'host_registration_remote_execution_pull' parameter for the host. If it is set to true, pull provider client will be deployed on the host": [
        ""
      ],
      "List of proxy IDs to be used for remote execution": [
        "Liste des ID de proxy à utiliser pour l'exécution à distance"
      ],
      "Trying to abort the job": [
        "Tentative d'abandon du job"
      ],
      "Trying to cancel the job": [
        "Tentative d'annulation du job"
      ],
      "The job cannot be aborted at the moment.": [
        "Impossible d'abandonner le job pour l'instant."
      ],
      "The job cannot be cancelled at the moment.": [
        "Impossible d'annuler le job pour l'instant."
      ],
      "Problem with previewing the template: %{error}. Note that you must save template input changes before you try to preview it.": [
        "Problème de prévisualisation du modèle : %{error}. Remarquez que vous devez avoir sauvé les changements du modèle d'entrée avant de pouvoir le prévisualiser."
      ],
      "Job template imported successfully.": [
        "Import du modèle de job réussi."
      ],
      "Unable to save template. Correct highlighted errors": [
        "Impossible de sauver le modèle. Merci de corriger les erreurs en surbrillance"
      ],
      "Run": [
        "Exécuter"
      ],
      "Schedule Remote Job": [
        "Programmer un job à distance"
      ],
      "Jobs": [
        "Jobs"
      ],
      "Job invocations": [
        "Lancement de jobs"
      ],
      "%s": [
        "%s"
      ],
      "Web Console": [
        "Console Web"
      ],
      "Success": [
        "Réussi"
      ],
      "Failed": [
        "Échec"
      ],
      "Pending": [
        "En attente"
      ],
      "Cancelled": [
        "Annulé"
      ],
      "queued to start executing in %{time}": [
        "ajouté en file d'attente pour lancer l'exécution dans %{time}"
      ],
      "queued": [
        "ajouté en file d'attente"
      ],
      "running %{percent}%%": [
        "Exécution en cours %{percent}%%"
      ],
      "succeeded": [
        "réussi"
      ],
      "cancelled": [
        "annulé"
      ],
      "failed": [
        "échec"
      ],
      "unknown status": [
        "état inconnu"
      ],
      "Any Organization": [
        "Toute Organisation"
      ],
      "Any Location": [
        "Tout emplacement"
      ],
      "error": [
        "erreur"
      ],
      "Host detail": [
        "Détails de l'hôte"
      ],
      "Rerun on %s": [
        "Relancement le %s"
      ],
      "Host task": [
        "Tâche d'hôte"
      ],
      "N/A": [
        "Sans objet"
      ],
      "Run Job": [
        "Lancer le job"
      ],
      "Create Report": [
        "Créer un rapport"
      ],
      "Create report for this job": [
        "Aucun rapport pour ce job"
      ],
      "Rerun": [
        "Relancer"
      ],
      "Rerun the job": [
        "Relancer le job"
      ],
      "Rerun failed": [
        "Échec du relancement"
      ],
      "Rerun on failed hosts": [
        "Relancer sur les hôtes où le job a échoué"
      ],
      "Job Task": [
        "Tâche de job"
      ],
      "See the last task details": [
        "Voir les détails de la dernière tâche"
      ],
      "Cancel Job": [
        "Annuler la tâche"
      ],
      "Try to cancel the job": [
        "Essai d'annulation du job"
      ],
      "Abort Job": [
        "Abandonner le job"
      ],
      "Try to abort the job without waiting for the results from the remote hosts": [
        "Essayer d'abandonner le job sans attendre les résultats des hôtes distants"
      ],
      "Task Details": [
        "Détails de la tâche"
      ],
      "See the task details": [
        "Voir les détails de la tâche"
      ],
      "Try to cancel the job on a host": [
        "Essai d'annulation du job sur un hôte"
      ],
      "Try to abort the job on a host without waiting for its result": [
        "Essayer d'abandonner le job sur un hôte sans attendre le résultat"
      ],
      "Could not render the preview because no host matches the search query.": [
        "Impossible d'afficher l'aperçu car aucun hôte ne correspond à la recherche."
      ],
      "in %s": [
        "sur %s"
      ],
      "%s ago": [
        "Il y a %s"
      ],
      "Use default description template": [
        "Utiliser le modèle de description par défaut"
      ],
      "Description template": [
        "Modèle de description"
      ],
      "This template is used to generate the description.<br/>Input values can be used using the syntax %{package}.<br/>You may also include the job category and template<br/>name using %{job_category} and %{template_name}.": [
        "Ce modèle est utilisé pour générer la description. <br/>Les valeurs d'entrée peuvent être utilisées avec la syntaxe %{package}.<br/>Vous pouvez aussi inclure la catégorie du job et le nom du modèle <br/> en utilisant %{job_category} et %{template_name}."
      ],
      "Could not use any template used in the job invocation": [
        "Impossible d'utiliser un modèle qui est utilisé pour un lancement de job"
      ],
      "Failed rendering template: %s": [
        "Echec de rendu du modèle : %s"
      ],
      "Task cancelled": [
        "Tâche annulée"
      ],
      "Job execution failed": [
        "Échec d'exécution du job"
      ],
      "%{description} on %{host}": [
        "%{description} sur %{host}"
      ],
      "Remote action:": [
        "Action distante :"
      ],
      "Job cancelled by user": [
        "Job annulé par l'utilisateur"
      ],
      "Exit status: %s": [
        "Statut de sortie : %s"
      ],
      "Job finished with error": [
        "Job terminé avec erreur"
      ],
      "Error loading data from proxy": [
        "Erreur de chargement des données depuis le proxy"
      ],
      "User can not execute job on host %s": [
        "L'utilisateur ne peut pas exécuter le job sur l'hôte %s"
      ],
      "User can not execute this job template": [
        "L'utilisateur ne peut pas exécuter ce modèle de job"
      ],
      "User can not execute job on infrastructure host %s": [
        "L’utilisateur ne peut pas exécuter un job sur un hôte d’infrastructure %s"
      ],
      "User can not execute this job template on %s": [
        "L'utilisateur ne peut pas exécuter ce modèle de job sur %s"
      ],
      "The only applicable proxy %{proxy_names} is down": [
        "Le seul proxy applicable %{proxy_names} est indisponible",
        "Tous les proxys %{count} applicables sont hors service. %{proxy_names} tenté",
        "Tous les proxys %{count} applicables sont hors service. %{proxy_names} tenté"
      ],
      "Could not use any proxy for the %{provider} job. Consider configuring %{global_proxy}, %{fallback_proxy} in settings": [
        "N’a pas pu utiliser de proxy pour le job %{provider}. Considérer configurer %{global_proxy}, %{fallback_proxy}dans les paramètres de configuration"
      ],
      "REX job has succeeded - %s": [
        "Job REX a réussi - %s"
      ],
      "REX job has failed - %s": [
        "Job REX a échoué - %s"
      ],
      "included template '%s' not found": [
        "Le modèle inclus %s est introuvable"
      ],
      "input macro with name '%s' used, but no input with such name defined for this template": [
        "La macro d'entrée au nom '%s' a été utilisée, mais aucune entrée avec ce nom n'est définie pour ce modèle"
      ],
      "Unable to fetch public key": [
        "Impossible de récupérer la clef publique"
      ],
      "Unable to remove host from known hosts": [
        "Impossible de retirer l'hôte des hôtes connus"
      ],
      "REX job has finished - %s": [
        "Job REX est terminé - %s"
      ],
      "Should this interface be used for remote execution?": [
        "L'interface d'exécution est celle utilisée pour l'exécution distante ?"
      ],
      "Interface with the '%s' identifier was specified as a remote execution interface, however the interface was not found on the host. If the interface exists, it needs to be created in Foreman during the registration.": [
        "L'interface avec l'identifiant '%s' a été spécifiée comme interface d'exécution à distance, mais l'interface n'a pas été trouvée sur l'hôte. Si l'interface existe, elle doit être créée dans Foreman lors de l'enregistrement."
      ],
      "host already has an execution interface": [
        "L'hôte possède déjà une interface d'exécution"
      ],
      "This template is locked. Please clone it to a new template to customize.": [
        "Ce modèle est verrouillé. Veuillez le cloner vers un nouveau modèle pour personnaliser ce dernier."
      ],
      "Circular dependency detected in foreign input set '%{template}' -> '%{target_template}'. Templates stack: %{templates_stack}": [
        "Dépendance circulaire détectée dans l'ensemble d'entrées externes '%%{template}' -> '%{target_template}'. Pile de modèles : %{templates_stack}"
      ],
      "Execution": [
        "Exécution"
      ],
      "Last execution succeeded": [
        "La dernière exécution a réussi"
      ],
      "No execution finished yet": [
        "Aucune exécution n'est encore terminée"
      ],
      "Last execution cancelled": [
        "La dernière exécution a été annulée"
      ],
      "Last execution failed": [
        "La dernière exécution a échoué"
      ],
      "Unknown execution status": [
        "État d'exécution inconnu"
      ],
      "Recursive rendering of templates detected": [
        "Détection de récursion dans le rendu des modèles"
      ],
      "error during rendering: %s": [
        "Erreurs pendant le rendu : %s"
      ],
      "template": [
        "modèle"
      ],
      "Cannot specify both bookmark_id and search_query": [
        "Impossible de spécifier simultanément bookmark_id et search_query"
      ],
      "Unknown input %{input_name} for template %{template_name}": [
        "Entrée inconnue %{input_name} pour le modèle %{template_name}"
      ],
      "Template with id '%{id}' was not found": [
        "Le modèle avec l'ID '%%{id} ' n'a pas été trouvé"
      ],
      "Feature input %{input_name} not defined in template %{template_name}": [
        "Entrée de la caractéristique %{input_name}non définie dans le modèle %{template_name}"
      ],
      "No template mapped to feature %{feature_name}": [
        "Aucun modèle n'est en relation avec la fonction %{feature_name}"
      ],
      "The template %{template_name} mapped to feature %{feature_name} is not accessible by the user": [
        "Le modèle %{template_name} en relation avec la fonction %{feature_name} n'est pas accessible par l'utilisateur"
      ],
      "Job Invocation": [
        "Lancement de job"
      ],
      "Duplicated inputs detected: %{duplicated_inputs}": [
        "Entrées dupliquées détectées : %{duplicated_inputs}"
      ],
      "Unknown remote execution feature %s": [
        "Fonction d'exécution distante inconnue %s"
      ],
      "Effective user method \\\"%{current_value}\\\" is not one of %{valid_methods}": [
        "La méthode de l'utilisateur effectif \\\"%{current_value}\\\" n'est pas l'une des méthodes de %{valid_methods}"
      ],
      "Could not find any suitable interface for execution": [
        "Impossible de trouver une interface qui convient pour l'exécution"
      ],
      "Subscribe to my failed jobs": [
        "Souscrire à mes jobs ayant échoué"
      ],
      "Subscribe to my succeeded jobs": [
        "Souscrire à mes jobs ayant réussi"
      ],
      "Subscribe to all my jobs": [
        "Souscrire à tous mes jobs"
      ],
      "Script": [
        "Script"
      ],
      "Static Query": [
        "Requête statique"
      ],
      "Dynamic Query": [
        "Requête dynamique"
      ],
      "Alphabetical": [
        "Alphabétique"
      ],
      "Randomized": [
        "Randomisé"
      ],
      "Cannot resolve hosts without a user": [
        "Impossible de résoudre les hôtes sans un utilisateur"
      ],
      "Cannot resolve hosts without a bookmark or search query": [
        "Impossible de résoudre les hôtes sans un marque page ou une recherche"
      ],
      "Must select a bookmark or enter a search query": [
        "Vous devez choisir un marque page ou saisir une recherche"
      ],
      "Input": [
        "Entrée"
      ],
      "Not all required inputs have values. Missing inputs: %s": [
        "Les entrées n'ont pas toutes des valeurs associées. Les entrées demandant de l'attention : %s"
      ],
      "Internal proxy selector can only be used if Katello is enabled": [
        "Le sélecteur de proxy interne ne peut être utilisé que si Katello est activé"
      ],
      "default_capsule method missing from SmartProxy": [
        "méthode default_capsule manquante dans SmartProxy"
      ],
      "Can't find Job Invocation for an id %s": [
        "Impossible de trouver l’invocation de job ayant pour id %s"
      ],
      "Latest Jobs": [
        "Derniers jobs"
      ],
      "Name": [
        "Nom"
      ],
      "State": [
        "État"
      ],
      "Started": [
        "Démarré"
      ],
      "No jobs available": [
        "Aucun job disponible"
      ],
      "Results": [
        "Résultats"
      ],
      "Schedule": [
        "Programmer"
      ],
      "Concurrency level limited to": [
        "Niveau de concurrence limité à"
      ],
      "tasks at a time": [
        "tâches à la fois"
      ],
      "Scheduled to start before": [
        "Programmé pour démarrer avant"
      ],
      "Scheduled to start at": [
        "Programmé pour démarrer à"
      ],
      "Timeout to kill after": [
        "Délai avant suppression après"
      ],
      "seconds": [
        "secondes"
      ],
      "Time to pickup": [
        ""
      ],
      "Target hosts": [
        "Hôtes cibles"
      ],
      "Bookmark": [
        "Signet"
      ],
      "Manual selection": [
        "Sélection manuelle"
      ],
      "using ": [
        "à l'aide de "
      ],
      "Execution order": [
        "Ordre d'exécution"
      ],
      "Organization": [
        "Organisation"
      ],
      "Location": [
        "Emplacement"
      ],
      "SSH User": [
        "Utilisateur SSH"
      ],
      "Evaluated at:": [
        "Évalue le :"
      ],
      "User Inputs": [
        "Entrées utilisateur"
      ],
      "Description": [
        "Description"
      ],
      "Job template": [
        "Modèle de job"
      ],
      "Resolves to": [
        "Résout en"
      ],
      "hosts": [
        "hôtes"
      ],
      "Refresh": [
        "Réactualiser"
      ],
      "Preview": [
        "Prévisualisation"
      ],
      "Display advanced fields": [
        "Afficher les champs avancés"
      ],
      "Hide advanced fields": [
        "Masquer les champs avancés"
      ],
      "SSH user": [
        ""
      ],
      "A user to be used for SSH.": [
        ""
      ],
      "Effective user": [
        "Utilisateur effectif"
      ],
      "A user to be used for executing the script. If it differs from the SSH user, su or sudo is used to switch the accounts.": [
        "L'utilisateur choisi pour l'exécution du script. Si l'utilisateur est différent de celui utilisé pour SSH, su ou sudo sera mis en œuvre pour changer d'utilisateur."
      ],
      "Timeout to kill": [
        "Délai avant suppression"
      ],
      "Time in seconds from the start on the remote host after which the job should be killed.": [
        "Durée en secondes depuis le démarrage sur l'hôte distant après laquelle le job doit être supprimé."
      ],
      "Interval in seconds, if the job is not picked up by a client within this interval it will be cancelled.": [
        ""
      ],
      "Password": [
        "Mot de passe"
      ],
      "Password is stored encrypted in DB until the job finishes. For future or recurring executions, it is removed after the last execution.": [
        "Le mot de passe est stocké sous une forme chiffrée dans la base de données jusqu'à la fin du job. Pour les exécutions futures ou récurrentes, il est supprimé après la dernière exécution."
      ],
      "Private key passphrase": [
        "Phrase de passe de la clé privée"
      ],
      "Key passhprase is only applicable for SSH provider. Other providers ignore this field. <br> Passphrase is stored encrypted in DB until the job finishes. For future or recurring executions, it is removed after the last execution.": [
        "La phrase de passe de la clé est uniquement applicable au fournisseur SSH. D'autres fournisseurs ignorent ce champ. <br> La phrase de passe est stockée chiffrée dans la base de données jusqu'à la fin du job. Pour les exécutions futures ou récurrentes, elle est supprimée après la dernière exécution."
      ],
      "Effective user password": [
        "Mot de passe effectif de l'utilisateur"
      ],
      "Effective user password is only applicable for SSH provider. Other providers ignore this field. <br> Password is stored encrypted in DB until the job finishes. For future or recurring executions, it is removed after the last execution.": [
        "Le mot de passe Sudo est uniquement applicable au fournisseur SSH. D'autres fournisseurs ignorent ce champ. <br> Le mot de passe est stocké chiffré dans la base de données jusqu'à la fin du job. Pour les exécutions futures ou récurrentes, il est supprimé après la dernière exécution."
      ],
      "Concurrency level": [
        "Niveau de parallélisme"
      ],
      "Run at most N tasks at a time. If this is set and proxy batch triggering is enabled, then tasks are triggered on the smart proxy in batches of size 1.": [
        "Effectuer au maximum N tâches à la fois. Si ce paramètre est défini et que le déclenchement par lot du proxy est activé, les tâches sont alors déclenchées sur le proxy smart par lots de taille 1."
      ],
      "Execution ordering": [
        "Ordre d'exécution"
      ],
      "Execution ordering determines whether the jobs should be executed on hosts in alphabetical order or in randomized order.<br><ul><li><b>Ordered</b> - executes the jobs on hosts in alphabetical order</li><li><b>Randomized</b> - randomizes the order in which jobs are executed on hosts</li></ul>": [
        "L'ordre d'exécution détermine si les jobs doivent être exécutés sur les hôtes par ordre alphabétique ou par ordre aléatoire. <br><ul><li><b>Ordonnancé</b> - exécute les jobs sur les hôtes par ordre alphabétique </li><li><b>Randomisé</b> - randomise l'ordre dans lequel les tâches sont exécutées sur les hôtes</li></ul>"
      ],
      "Type of query": [
        "Type de requête"
      ],
      "Type has impact on when is the query evaluated to hosts.<br><ul><li><b>Static</b> - evaluates just after you submit this form</li><li><b>Dynamic</b> - evaluates just before the execution is started, so if it's planned in future, targeted hosts set may change before it</li></ul>": [
        ""
      ],
      "The final host list may change because the selected query is dynamic.  It will be rerun during execution.": [
        "La liste définitive des hôtes peut changer car le type de requête est dynamique. Elle sera relancée pendant l'exécution."
      ],
      "...and %{count} more": [
        "...et %{count} de plus",
        "...et %{count} de plus",
        "...et %{count} de plus"
      ],
      "No hosts found.": [
        "Aucun hôte trouvé."
      ],
      "Close": [
        "Fermer"
      ],
      "Current organization %{org_c} is different from job's organization %{org_j}.": [
        "L'organisation actuelle %{org_c} est différente de l'organisation du job %{org_j}."
      ],
      "Current location %{loc_c} is different from job's location %{loc_j}.": [
        "L’emplacement actuel %{loc_c} est différent de l’emplacement du job %{loc_j}."
      ],
      "The dynamic query '%{query}' was not resolved yet. The list of hosts to which it would resolve now can be seen %{here}.": [
        "La requête dynamique '%{query}' n'a pas encore été résolue. La liste des hôtes actuelle avec lesquels ils pourraient être résolus peut être vue ici %{here}."
      ],
      "here": [
        "ici"
      ],
      "effective user": [
        "utilisateur effectif"
      ],
      "Total hosts": [
        "Total des hôtes"
      ],
      "Hosts gone missing": [
        "Hôtes disparus"
      ],
      "This can happen if the host is removed or moved to another organization or location after the job was started": [
        "Cela peut se produire si l'hôte est supprimé ou déplacé vers une autre organisation ou un autre emplacement après le lancement du job"
      ],
      "Providers and templates": [
        "Modèles et fournisseurs"
      ],
      "User input": [
        "Entrée utilisateur"
      ],
      "Value": [
        "Valeur"
      ],
      "Search Query": [
        "Requête de recherche"
      ],
      "Status": [
        "Statut"
      ],
      "Succeeded": [
        "Réussie"
      ],
      "Start": [
        "Démarrer"
      ],
      "Job invocation": [
        "Invocation de job"
      ],
      "Use new job wizard": [
        ""
      ],
      "Overview": [
        "Vue d'ensemble"
      ],
      "Preview templates": [
        "Modèles de prévisualisation"
      ],
      "Recurring logic": [
        "Logique récurrente"
      ],
      "Job Invocations": [
        "Invocation de tâches"
      ],
      "Foreman can run arbitrary commands on remote hosts using different providers, such as SSH or Ansible. Communication goes through the Smart Proxy so Foreman does not have to have direct access to the target hosts and can scale to control many hosts.": [
        "Foreman peut exécuter des commandes arbitraires sur des hôtes distants utilisant différents fournisseurs, tels que SSH ou Ansible. La communication passe par le proxy intelligent, de sorte que Foreman n'a pas besoin d'avoir un accès direct aux hôtes cibles et peut évoluer pour contrôler de nombreux hôtes."
      ],
      "Learn more about this in the documentation.": [
        "Approfondissez ce sujet dans la documentation."
      ],
      "Job": [
        "Tâche"
      ],
      "Type": [
        "Type"
      ],
      "Add Foreign Input Set": [
        "Ajout d'un jeu de données en entrée externes"
      ],
      "add an input set for this template to reference a different template inputs": [
        "Ajout d'un jeu d'entrées pour ce modèle pour faire référence à des entrées sur un modèle différent"
      ],
      "Snippet": [
        "Snippet"
      ],
      "Select an ERB file to upload in order to import a job template.  The template must contain metadata in the first ERB comment.": [
        "Choisir un fichier ERB à transmettre pour l'import du modèle du job. Le modèle doit contenir les metadata dans le premier commentaire ERB."
      ],
      "Overwrite": [
        "Remplacer"
      ],
      "Whether to overwrite the template if it already exists": [
        "Défini si le modèle doit être remplacé s'il existe déjà"
      ],
      "Job Templates": [
        "Modèles de job"
      ],
      "Edit %s": [
        "Modifier %s"
      ],
      "Edit Job Template": [
        "Éditer le modèle de job"
      ],
      "Import": [
        "Importation"
      ],
      "New Job Template": [
        "Nouveau modèle de job"
      ],
      "JobTemplate|Name": [
        "Nom"
      ],
      "JobTemplate|Snippet": [
        "Snippet"
      ],
      "JobTemplate|Locked": [
        "Verrouillé"
      ],
      "Actions": [
        "Actions"
      ],
      "This template is locked for editing.": [
        "Ce modèle est verrouillé contre les modifications."
      ],
      "The execution interface is used for remote execution": [
        "L'interface d'exécution est celle utilisée pour l'exécution distante"
      ],
      "Remote execution": [
        "Exécution distante"
      ],
      "Remote Execution": [
        "Exécution distante"
      ],
      "Proxies": [
        "Proxies"
      ],
      "Select as many remote execution proxies as applicable for this subnet.  When multiple proxies with the same provider are added, actions will be load balanced among them.": [
        "Choisir tous les proxies d'exécution distante applicables pour ce sous-réseau. Quand plusieurs proxies avec un même fournisseur sont ajoutés, les actions seront réparties sur chacun d'entre eux."
      ],
      "You are not allowed to see the currently assigned template. Saving the form now would unassign the template.": [
        "Vous n'êtes pas autorisé à afficher le modèle affecté en cours. La Sauvegarde du formulaire en cours supprimerait l'affectation au modèle."
      ],
      "Remote Execution Features": [
        "Capacités d'exécution distantes"
      ],
      "Label": [
        "Balise"
      ],
      "Edit Remote Execution Feature": [
        "Modifier la capacité d'exécution distante"
      ],
      "A job '%{job_name}' has %{status} at %{time}": [
        "Un job '%{job_name}' a %{status} à %{time}"
      ],
      "Job result": [
        "Résultat Job"
      ],
      "Failed hosts": [
        "Hôtes ayant échoué"
      ],
      "See more details at %s": [
        "Plus de détails ici %s"
      ],
      "Foreign input set": [
        "Jeux de données en entrée externes"
      ],
      "remove template input set": [
        "supprimer un modèles des données en entrée"
      ],
      "A comma separated list of input names to be excluded from the foreign template.": [
        "Une liste des noms d'entrée du modèle externe à exclure, séparées par des virgules."
      ],
      "Template Invocation for %s": [
        "Invocation de modèle pour %s"
      ],
      "Back to Job": [
        "Retour aux job"
      ],
      "Toggle command": [
        "Afficher les commandes"
      ],
      "Toggle STDERR": [
        "Afficher STDERR"
      ],
      "Toggle STDOUT": [
        "Afficher STDOUT"
      ],
      "Toggle DEBUG": [
        "Afficher STDOUT"
      ],
      "Target: ": [
        "Cible :"
      ],
      "using Smart Proxy": [
        "Créer un proxy Smart"
      ],
      "Scroll to bottom": [
        "Faire défiler en bas de page"
      ],
      "Scroll to top": [
        "Faire défiler en haut de page"
      ],
      "Could not display data for job invocation.": [
        "Impossible d'afficher les données pour le lancement du job."
      ],
      "Unsupported or no operating system found for this host.": [
        "Système d'exploitation non supporté ou inexistant pour cet hôte."
      ],
      "A job '%{subject}' has finished successfully": [
        "Un job '%{subject}' s'est terminé avec succès"
      ],
      "Job Details": [
        "Détails Job"
      ],
      "A job '%{subject}' has failed": [
        "Un job '%{subject}' a échoué"
      ],
      "Remote execution job": [
        "Job à exécution distante"
      ],
      "A notification when a job finishes": [
        "Une notification quand un job se termine"
      ],
      "Unable to create mail notification: %s": [
        "Impossible de créer une notification par e-mail : %s"
      ],
      "Search the host for any proxy with Remote Execution, useful when the host has no subnet or the subnet does not have an execution proxy": [
        "Recherche d'un proxy avec exécution distante sur l'hôte, utile quand l'hôte n'a pas de sous-réseau ou que le sous-réseau n'a pas de proxy avec exécution distante"
      ],
      "Fallback to Any Proxy": [
        "Repli sur n'importe quel proxy"
      ],
      "Search for remote execution proxy outside of the proxies assigned to the host. The search will be limited to the host's organization and location.": [
        "La recherche pour un proxy d'exécution en dehors des proxies assignés à l'hôte. La recherche sera cantonnée à l'organisation ou à l'emplacement de l'hôte."
      ],
      "Enable Global Proxy": [
        "Activer le proxy global"
      ],
      "Default user to use for SSH.  You may override per host by setting a parameter called remote_execution_ssh_user.": [
        "L'utilisateur par défaut pour SSH. Vous pouvez remplacer cette valeur par hôte, en définissant un paramètre nommé remote_execution_ssh_user."
      ],
      "Default user to use for executing the script. If the user differs from the SSH user, su or sudo is used to switch the user.": [
        "L'utilisateur par défaut pour l'exécution du script. Si l'utilisateur est différent de celui utilisé pour SSH, su ou sudo sera mis en œuvre pour changer d'utilisateur."
      ],
      "Effective User": [
        "Utilisateur effectif"
      ],
      "What command should be used to switch to the effective user. One of %s": [
        "La commande qui doit être utilisée pour changer l'utilisateur effectif. En choisir une parmi %s"
      ],
      "Effective User Method": [
        "Méthode d'utilisateur effectif"
      ],
      "Whether we should sync templates from disk when running db:seed.": [
        "Défini si nous devons synchroniser les modèles depuis le disque lors de l'exécution de db:seed."
      ],
      "Sync Job Templates": [
        "Modèles de job synchronisés"
      ],
      "Port to use for SSH communication. Default port 22. You may override per host by setting a parameter called remote_execution_ssh_port.": [
        "Port à utiliser pour la communication SSH. Le port par défaut est 22. Vous pouvez le remplacer selon les hôtes en définissant un paramètre appelé remote_execution_ssh_port."
      ],
      "SSH Port": [
        "Port SSH"
      ],
      "Should the ip addresses on host interfaces be preferred over the fqdn? It is useful when DNS not resolving the fqdns properly. You may override this per host by setting a parameter called remote_execution_connect_by_ip. For dual-stacked hosts you should consider the remote_execution_connect_by_ip_prefer_ipv6 setting": [
        "Les adresses IP sur les interfaces hôtes doivent-elles être préférées au nom fqdn ? Cela est utile lorsque DNS ne résout pas les noms fqdn correctement. Vous pouvez les remplacer selon les hôtes en définissant un paramètre appelé remote_execution_connect_by_ip. Pour les hôtes à double empilement, vous devez prendre en compte le paramètre remote_execution_connect_by_ip_prefer_ipv6"
      ],
      "Connect by IP": [
        "Connexion via IP"
      ],
      "When connecting using ip address, should the IPv6 addresses be preferred? If no IPv6 address is set, it falls back to IPv4 automatically. You may override this per host by setting a parameter called remote_execution_connect_by_ip_prefer_ipv6. By default and for compatibility, IPv4 will be preferred over IPv6 by default": [
        "Lors de la connexion à l'aide d'une adresse IP, les adresses IPv6 doivent-elles être privilégiées ? Si aucune adresse IPv6 n'est définie, le système revient automatiquement à IPv4. Vous pouvez modifier cette option pour chaque hôte en définissant un paramètre appelé remote_execution_connect_by_ip_prefer_ipv6. Par défaut et pour des raisons de compatibilité, IPv4 sera préféré à IPv6"
      ],
      "Prefer IPv6 over IPv4": [
        "Favoriser IPv6 par rapport à IPv4"
      ],
      "Default password to use for SSH. You may override per host by setting a parameter called remote_execution_ssh_password": [
        "Mot de passe par défaut à utiliser pour SSH. Vous pouvez remplacer cette valeur par hôte en définissant un paramètre nommé remote_execution_ssh_password"
      ],
      "Default SSH password": [
        "Mot de passe SSH par"
      ],
      "Default key passphrase to use for SSH. You may override per host by setting a parameter called remote_execution_ssh_key_passphrase": [
        "Phrase de passe de clé par défaut à utiliser pour SSH. Vous pouvez remplacer cette valeur par hôte en définissant un paramètre nommé remote_execution_ssh_key_passphrase"
      ],
      "Default SSH key passphrase": [
        "Phrase de passe de clé par défaut"
      ],
      "Amount of workers in the pool to handle the execution of the remote execution jobs. Restart of the dynflowd/foreman-tasks service is required.": [
        "Nombre de workers dans le pool permettant de gérer l'exécution des jobs d'exécution à distance. Le redémarrage du service dynflowd/foreman-tasks est requis."
      ],
      "Workers pool size": [
        "Taille du pool de workers"
      ],
      "When enabled, working directories will be removed after task completion. You may override this per host by setting a parameter called remote_execution_cleanup_working_dirs.": [
        "Lorsque cette option est activée, les répertoires de travail sont supprimés à la fin de la tâche. Vous pouvez remplacer ce paramètre par hôte en définissant un paramètre appelé remote_execution_cleanup_working_dirs."
      ],
      "Cleanup working directories": [
        "Nettoyage des répertoires de travail"
      ],
      "Where to find the Cockpit instance for the Web Console button.  By default, no button is shown.": [
        "Où trouver l'instance du Cockpit pour le bouton de la console Web.  Par défaut, aucun bouton n'est affiché."
      ],
      "Cockpit URL": [
        "URL Cockpit"
      ],
      "Choose a job template that is pre-selected in job invocation form": [
        "Choisissez un modèle qui soit présélectionné dans le formulaire de requête du job"
      ],
      "Form Job Template": [
        "Nouveau modèle de job"
      ],
      "Select a report template used for generating a report for a particular remote execution job": [
        "Sélectionnez un modèle de rapport utilisé pour générer un rapport pour un job d'exécution à distance particulier"
      ],
      "Job Invocation Report Template": [
        "Modèle de rapport d’invocation de job"
      ],
      "Time in seconds within which the host has to pick up a job. If the job is not picked up within this limit, the job will be cancelled. Defaults to 1 day. Applies only to pull-mqtt based jobs.": [
        ""
      ],
      "Job templates": [
        "Modèles de job"
      ],
      "Run Puppet Once": [
        "Lancer Puppet"
      ],
      "Perform a single Puppet run": [
        "Effectuer une exécution Puppet unique"
      ],
      "Run Script": [
        ""
      ],
      "Run a script": [
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
        "Pas de répétition"
      ],
      "Cronline": [
        "Cronline"
      ],
      "Monthly": [
        "Mensuel"
      ],
      "Weekly": [
        "Chaque semaine"
      ],
      "Daily": [
        "Quotidien"
      ],
      "Hourly": [
        "Toutes les heures"
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
        "Hôtes cibles et entrées"
      ],
      "Advanced fields": [
        "Champs avancés"
      ],
      "Review details": [
        "Détails de la revue"
      ],
      "Type of execution": [
        ""
      ],
      "Hosts": [
        "Hôtes"
      ],
      "Host collections": [
        "Collections d'hôtes"
      ],
      "Host groups": [
        "Groupes d'hôtes"
      ],
      "Search query": [
        "Requête de recherche"
      ],
      "Run job": [
        "Lancer le job"
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
        "Modifier le modèle de description du job"
      ],
      "Preview job description": [
        "Prévisualisation de la description du job"
      ],
      "For example: 1, 2, 3, 4, 5...": [
        "Par exemple: 1, 2, 3, 4, 5..."
      ],
      "Interval in seconds, if the job is not picked up by a client within this interval it will be cancelled. Applies only to pull-mqtt based jobs": [
        ""
      ],
      "Key passphrase is only applicable for SSH provider. Other providers ignore this field. Passphrase is stored encrypted in DB until the job finishes. For future or recurring executions, it is removed after the last execution.": [
        "La phrase de passe de la clé est uniquement applicable au fournisseur SSH. D'autres fournisseurs ignorent ce champ. La phrase de passe est stockée chiffrée dans la base de données jusqu'à la fin du job. Pour les exécutions futures ou récurrentes, elle est supprimée après la dernière exécution."
      ],
      "Effective user password is only applicable for SSH provider. Other providers ignore this field. Password is stored encrypted in DB until the job finishes. For future or recurring executions, it is removed after the last execution.": [
        "Le mot de passe Sudo est uniquement applicable au fournisseur SSH. D'autres fournisseurs ignorent ce champ. Le mot de passe est stocké chiffré dans la base de données jusqu'à la fin du job. Pour les exécutions futures ou récurrentes, il est supprimé après la dernière exécution."
      ],
      "All fields are required.": [
        "Tous les champs sont obligatoires."
      ],
      "Error": [
        "Erreur"
      ],
      "Errors:": [
        "Erreurs :"
      ],
      "Categories list failed with:": [
        "La liste de catégories a échoué avec :"
      ],
      "Templates list failed with:": [
        "La liste des modèles a échoué avec :"
      ],
      "Template failed with:": [
        "Le modèle à échoué avec :"
      ],
      "Preview Hosts": [
        "Prévisualisation des hôtes"
      ],
      "...and %s more": [
        "...et %s de plus"
      ],
      "%s more": [
        ""
      ],
      "Clear all filters": [
        ""
      ],
      "There are no available input fields for the selected template.": [
        "Il n’y a pas de champs d’entrées disponibles pour le modèle sélectionné."
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
        "Filtrer par hôte"
      ],
      "Filter by host collections": [
        "Filtrer les collections d'hôtes"
      ],
      "Filter by host groups": [
        "Filtrer par groupe d’hôtes"
      ],
      "Apply to": [
        "Appliquer à"
      ],
      "Never": [
        "Jamais"
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
        "Ligne Cron"
      ],
      "No Target Hosts": [
        "Aucun Hôte cible"
      ],
      "view host names": [
        ""
      ],
      "Hide all advanced fields": [
        "Masquer tous les champs avancés"
      ],
      "Show all advanced fields": [
        "Afficher tous les champs avancés"
      ],
      "Schedule type": [
        "Type de programmation"
      ],
      "Recurrence": [
        "Récurrence"
      ],
      "Starts at": [
        "Démarrage à"
      ],
      "Starts Before": [
        ""
      ],
      "Starts": [
        "Démarrage"
      ],
      "Now": [
        ""
      ],
      "Repeats": [
        "Répétitions"
      ],
      "Ends": [
        "Se termine"
      ],
      "Purpose": [
        "Objectif"
      ],
      "Static query": [
        "Requête statique"
      ],
      "Dynamic query": [
        "Requête dynamique"
      ],
      "Description Template": [
        "Modèle de description"
      ],
      "A special label for tracking a recurring job. There can be only one active job with a given purpose at a time.": [
        "Une balise spéciale pour le suivi d'un travail récurrent. Il ne peut y avoir qu'un seul job actif avec un objectif donné."
      ],
      "Query type": [
        "Type de requête"
      ],
      "Type has impact on when is the query evaluated to hosts.": [
        "Le type a un impact sur le moment où la requête est évaluée par les hôtes."
      ],
      "evaluates just after you submit this form": [
        "évalue dès que vous soumettez ce formulaire"
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
        "est minute (plage: 0-59)"
      ],
      "is hour (range: 0-23)": [
        "est heure (plage: 0-23)"
      ],
      "is day of month (range: 1-31)": [
        "est jour du mois (plage: 1-31)"
      ],
      "is month (range: 1-12)": [
        "est mois (Plage: 1-12)"
      ],
      "is day of week (range: 0-6)": [
        "est jour de la semaine (plage: 0-6)"
      ],
      "The cron line supports extended cron line syntax. For details please refer to the ": [
        ""
      ],
      "documentation": [
        ""
      ],
      "At": [
        "À"
      ],
      "Invalid time format": [
        "intervalle de temps invalide"
      ],
      "At minute": [
        "À la minute"
      ],
      "range: 0-59": [
        ""
      ],
      "Create": [
        "Créer"
      ],
      "Minute can only be a number between 0-59": [
        ""
      ],
      "Days": [
        "Jours"
      ],
      "Days of week": [
        "Jours de la semaine"
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
        "Démarre avant"
      ],
      "End time needs to be after start time": [
        "Heure de fin doit être après l’heure de départ"
      ],
      "On": [
        "Activé"
      ],
      "After": [
        ""
      ],
      "Repeat amount can only be a positive number": [
        "Le montant répété ne peut correspondre qu’à un nombre positif"
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
        "Chemin invalide"
      ],
      "open-help-tooltip-button": [
        "open-help-tooltip-button"
      ],
      "Reset to default": [
        "Réinitialiser"
      ],
      "Has to be a positive number": [
        "Doit correspondre à un nombre positif"
      ],
      "Please refine your search.": [
        "Veuillez raffiner votre recherche."
      ],
      "You have %s results to display. Showing first %s results": [
        "Vous avez %s résultats à afficher. Afficher les %s premiers résultats"
      ],
      "Opening job invocation form": [
        ""
      ],
      "%s job has been invoked": [
        "%s job a été invoqué"
      ],
      "Schedule a job": [
        "Planifier un job"
      ],
      "Recent jobs": [
        "Jobs récents"
      ],
      "View all jobs": [
        "Voir tous les jobs"
      ],
      "View finished jobs": [
        "Voir les jobs terminés"
      ],
      "View running jobs": [
        "Voir les jobs en cours d’exécution"
      ],
      "View scheduled jobs": [
        "Vois les jobs programmés"
      ],
      "Finished": [
        "Terminé"
      ],
      "Running": [
        "Exécution en cours"
      ],
      "Scheduled": [
        "Prévu"
      ],
      "No results found": [
        "Aucun résultat"
      ],
      "Remote Execution Interface": [
        "Capacités d'exécution distantes"
      ],
      "yes": [
        "oui"
      ],
      "no": [
        "non"
      ],
      "Inherit from host parameter": [
        "Hérité d'un paramètre d’hôte"
      ],
      "Yes (override)": [
        "Oui (remplacement)"
      ],
      "No (override)": [
        "Non (remplacement)"
      ],
      "REX pull mode": [
        ""
      ],
      "Setup remote execution pull mode. If set to `Yes`, pull provider client will be deployed on the registered host. The inherited value is based on the `host_registration_remote_execution_pull` parameter. It can be inherited e.g. from host group, operating system, organization. When overridden, the selected value will be stored on host parameter level.": [
        ""
      ],
      "Host": [
        "Hôte"
      ],
      "Active Filters:": [
        ""
      ],
      "Action with sub plans": [
        "Action avec sous-plans"
      ],
      "Check for long running tasks": [
        ""
      ],
      "Deliver notifications about long running tasks": [
        ""
      ],
      "Import Puppet classes": [
        "Importer des classes Puppet"
      ],
      "Import facts": [
        "Importer des faits"
      ],
      "A plugin bringing remote execution to the Foreman, completing the config management functionality with remote management functionality.": [
        "Un greffon qui apporte l'exécution distante à Foreman, complétant la fonction de gestion de configuration avec la fonction d'exécution distante."
      ],
      "Cron line format 'a b c d e', where:": [
        "Format de ligne cron 'a b c d' avec :"
      ],
      "#~ \"Distribute execution over N seconds. If this is set and proxy batch triggering\"#~ \" is enabled, then tasks are triggered on the smart proxy in batches of size 1.\"": [
        "#~ \"Répartir l'exécution sur N secondes. Si ce paramètre est défini et que le décl\"#~ \"enchement par lot du proxy est activé, les tâches sont alors déclenchées sur l\"#~ \"e proxy intelligent par lots de taille 1.\""
      ],
      "Distribute tasks over N seconds": [
        "Distribue les tâches sur N secondes"
      ],
      "Set to distribute over": [
        "Défini pour distribuer sur"
      ],
      "Time span": [
        "Durée"
      ]
    }
  }
};