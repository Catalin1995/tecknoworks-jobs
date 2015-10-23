json.code 200
json.body do |json|
  json.partial! 'candidate', collection: @candidates, as: :candidate
end
