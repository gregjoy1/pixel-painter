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

			def set_angular_xsrf_cookie
				response.set_cookie(:'XSRF-TOKEN', value: (session[:csrf] ||= SecureRandom.hex(32)), expires: Time.now + 3600*24)
			end

		end

		helpers ResponseHelper

	end

end