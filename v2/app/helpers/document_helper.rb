module Pxlpainter

	class App

		module DocumentHelper

			def edit_and_validate_document document_id, name, json, account_id

				if document_id.nil? || name.nil? || json.nil? || account_id.nil?
					return false;
				end

				if validate_document_json json
					document = Document.find(document_id)
					document.name = name
					document.json = json
					document.account_id = account_id
					document.save

					return document
				end

				false

			end

			def create_and_validate_document name, json, account_id

				if name.nil? || json.nil? || account_id.nil?
					return false;
				end

				if validate_document_json json
					document = Document.new
					document.name = name
					document.json = json
					document.account_id = account_id
					document.save

					return document
				end

				false

			end

			# Function that validates document data JSON
			def validate_document_json json

				# Checks if JSON syntax is valid
				begin
					document_data = JSON.parse json
				rescue JSON::ParserError => error

					return { 
						:valid => false, 
						:error => error
					}

				end

				width = document_data.width
				height = document_data.height

				# Checks that document map height is correct
				if document_data.data.length != height

					return { 
						:valid => false, 
						:error => 'Document data height is invalid'
					}

				end

				# Checks that document map width is correct
				document_data.data.each do |row|
					
					if row.length != width
						return { 
							:valid => false, 
							:error => 'Document data width is invalid'
						}
					end

					# Checks that document map rgb definition for each tile is correct
					row.each do |tile|
						if tile.length != 3
							return { 
								:valid => false, 
								:error => 'Document data color definition is invalid'
							}
						end
					end

				end

				{ 
					:valid => true, 
					:error => false
				}

			end

			def strip_document_model_array documents

				stripped_model_array = Array.new

				documents.each do |document|
					stripped_model_array.push strip_document_model document
				end

				stripped_model_array

			end

			def strip_document_model document

				{
					:id 			=> document.id,
					:name			=> document.name,
					:data 			=> document.json,
					:last_updated	=> document.updated_at
				}

			end

		end

		helpers DocumentHelper

	end

end