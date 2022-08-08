# Expires map
map $sent_http_content_type $expires {
    default                    off;
    text/html                  epoch;
    text/css                   max;
    application/javascript     max;
    ~image/                    max;
	application/octet-stream   max;	
}

server {
	listen			80;
    server_name		kids-lab.fotijr.com;
	return          301 https://kids-lab.fotijr.com$request_uri;
}

server {
    listen              443 ssl;
    server_name         kids-lab.fotijr.com;
    ssl_certificate     /etc/letsencrypt/live/kids-lab.fotijr.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/kids-lab.fotijr.com/privkey.pem;
	root                /srv/kids-lab.fotijr.com/front-end;
	access_log          /srv/kids-lab.fotijr.com/logs/access.log; 
	error_log           /srv/kids-lab.fotijr.com/logs/error.log warn;
	expires             $expires;

	location / {
		try_files $uri $uri/ /index.html;
	}

    location /api/ {
        proxy_pass                  http://localhost:5252/;
        proxy_http_version          1.1;
        proxy_set_header            Upgrade $http_upgrade;
        proxy_set_header            Connection keep-alive;
        proxy_set_header            Host $host;
        proxy_cache_bypass          $http_upgrade;
        proxy_set_header            X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header            X-Forwarded-Proto $scheme;
        
        # proxy adjustments to prevent random 502 upstream nginx errors
        proxy_temp_file_write_size  64k;
        proxy_connect_timeout       10080s;
        proxy_send_timeout          10080;
        proxy_read_timeout          10080;
        proxy_buffer_size           64k;
        proxy_buffers               16 32k;
        proxy_busy_buffers_size     64k;
        proxy_redirect              off;
        proxy_request_buffering     off;
        proxy_buffering             off;
    }

    location /api/hubs/ {
		proxy_pass         http://localhost:5252/hubs/;
        proxy_http_version 1.1;
        proxy_set_header   Connection keep-alive;
        proxy_set_header   Host $host;
		proxy_set_header   Upgrade "websocket";
		proxy_set_header   Connection "Upgrade";
        proxy_cache_bypass $http_upgrade;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
	}

    add_header X-Content-Type-Options "nosniff" always;
	add_header Referrer-Policy "no-referrer-when-downgrade";
	add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
	add_header X-Frame-Options "SAMEORIGIN" always;
	add_header X-Xss-Protection "1; mode=block" always;
	add_header Content-Security-Policy "img-src 'self' blob: data:; object-src 'self' blob: data:; default-src https: data: 'unsafe-inline' 'unsafe-eval'; connect-src 'self';" always;
}
