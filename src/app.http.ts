import fs from 'fs';
import http from 'http';
import { Request, Response } from 'express';


const server = http.createServer((req: Request, res: Response) => {

    console.log(req.url);
    

    /* Ejemplo 1 */
    // res.writeHead(200, {'Content-type': 'text/html'});
    // res.write(`<h1>URL ${ req.url }</h1>`);
    // res.end();

/* Ejemplo 2 */
    // const data = { name: 'John Doe', age: 30, city: 'New York' };

    // res.writeHead(200, { 'Content-Type': 'application/json' });
    // res.end(JSON.stringify(data));

/* Ejemplo 3 */

if (req.url === '/favicon.ico') {
    // Si no tienes un favicon, puedes devolver un 404 o un contenido vacío
    res.writeHead(404, { 'Content-Type': 'image/x-icon' });
    res.end();
    return;
}

    if ( req.url === '/' ) {
        const htmlFile = fs.readFileSync('./public/index.html', 'utf-8');
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(htmlFile);
        return;
    }

    if (req.url?.endsWith('.css')) {
        res.writeHead(200, {'Content-Type': 'text/css'});
    } else if (req.url?.endsWith('.js')) {
        res.writeHead(200, {'Content-Type': 'application/javascript'});
    }

    const responseContent = fs.readFileSync(`./public${ req.url }`, 'utf-8');
    res.end(responseContent);

});


server.listen(8080, () => {
    console.log('Server running on port 8080');
    
})