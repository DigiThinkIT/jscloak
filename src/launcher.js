//https://nodejs.org/api/child_process.html#child_process_child_process
const spawn = require('child_process').spawn;

/*start('firefox', ['--blah'],
        (data) => console.log("browser printed ${data}")
        (err) => console.log("error ${err}"),
        (status) => console.log("exited ${status}")
        );*/

function launch(path, cmd_args, on_data, on_error, on_close, extra_close_arg) {
   const proc = spawn(path, cmd_args);

   if (cmd_args == null) cmd_args = [];
   if (on_data == null) on_data = (data) => null;
   if (on_error == null) on_error = (data) => null;
   if (on_close == null) on_close = (code) => null;
   if (extra_close_arg == null) extra_close_arg = -1;

   proc.stdout.on('data', (data) => on_data(data.toString()));
   proc.stderr.on('data', (data) => on_error(data.toString()));
   proc.on('close', (code) => on_close(code, extra_close_arg));
   return proc;
}

module.exports.launch = launch;
