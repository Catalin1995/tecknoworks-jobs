ActiveAdmin.register_page 'Dashboard' do
  menu priority: 1, label: proc { I18n.t('active_admin.dashboard') }

  content title: proc { I18n.t('active_admin.dashboard') } do
    columns do
      column do
        panel 'F.A.Q.' do
          span do
            textarea id: 'job_description', style: 'display: none' do
              Job.dashboard_description
            end
            render 'admin/jobs/markdown_editor'
          end
          form do
            fieldset class: :actions do
              ul do
                li class: :cancel do
                  link_to 'Add a job', new_admin_job_path
                end
                li class: :cancel do
                  link_to 'View jobs', admin_jobs_path
                end
              end
            end
          end
          form do
            fieldset class: :actions do
              ul do
                li class: :cancel do
                  link_to 'Add a candidate', new_admin_candidate_path
                end
                li class: :cancel do
                  # Needs to be able to filter by job
                  link_to 'View candidates', admin_candidates_path
                end
              end
            end
          end
          form do
            fieldset class: :actions do
              ul do
                li class: :cancel do
                  # link_to 'Add an interview', new_admin_interview_path
                end
                li class: :cancel do
                  # link_to 'View interviews', admin_interviews_path
                end
              end
            end
          end
        end
      end
      column do
        panel 'Statistics' do
          div do
            # TODO: use scopes
            "#{Job.where(status: Job::PUBLISHED).count}/#{Job.count} published jobs"
          end
          div do
            'TODO: 0 candidates need interviewing'
          end
        end
      end
    end
  end
end
