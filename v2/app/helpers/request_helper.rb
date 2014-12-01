module Pxlpainter

	class App

		module RequestHelper
			
			# gets JSON request params as Angular sends it this way
			def get_json_request
				JSON.parse(request.body.read)
			end

		end

		helpers RequestHelper

	end

end