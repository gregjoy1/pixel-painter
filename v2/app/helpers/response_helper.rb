module Pxlpainter

	class App

		module ResponseHelper
			
			# DRY function for generating uniform JSON
			# response for JS frontend
			def generate_response error, data
				{ :error => error, :data => data }.to_json
			end

			# DRY function for setting content type header
			def get_content_type_header content_type = :json
				content_type content_type
			end

		end

		helpers ResponseHelper

	end

end