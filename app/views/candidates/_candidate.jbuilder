json.(candidate, :id, :full_name, :phone_number, :email, :job_id, :source, :created_at, :updated_at, :status)
json.number_of_interviews Interview.where(candidate_id: candidate.id).count
