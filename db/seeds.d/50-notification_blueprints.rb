blueprints = [
  {
    group: N_('Jobs'),
    name: 'rex_job_succeeded',
    message: N_("A job '%{subject}' has finished successfully"),
    level: 'success',
    actions:
    {
      links:
      [
        path_method: :job_invocation_path,
        title: N_('Job Details'),
      ],
    },
  },
]

blueprints.each { |blueprint| UINotifications::Seed.new(blueprint).configure }
