import Path from 'path';
import swal from 'sweetalert2';
import { shell } from 'electron'

export default {
    keyMap : {
        'delete': 'del',
        'moveUp': 'up',
        'moveDown': 'down',
        'moveLeft': 'left',
        'moveRight': 'right',
        'copy': [
            'command+c', 'ctrl+c'
        ],
        'paste': [
            'command+v', 'ctrl+v'
        ],
        'open': 'enter',
        'rename': [
            'command+down', 'ctrl+down'
        ],
        'preview': [ 'space' ]
    },
    handlers : ( self, list, path, file ) => {
        return {
            delete: ( e ) => {
                e.preventDefault( );
                swal({
                    title: "Are you sure?",
                    text: "You will not be able to recover this file!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes, delete it!"
                }).then( function ( ) {
                    let fullPath = file
                        ? Path.join( path, file )
                        : path;

                    shell.moveItemToTrash( fullPath );
                    self._selectPath(file
                        ? path
                        : Path.join( path, '..' ));
                    swal({ title: "File deleted", text: "Your file has been deleted", timer: 1000, showConfirmButton: true, type: 'success' });
                });

            },
            rename: ( e ) => {
                e.preventDefault( );
                let fileName = "";
                if ( file ) {
                    fileName = file;
                } else {
                    let pathList = path.split( '/' );
                    fileName = pathList[pathList - 1];
                }
                swal({
                    title: "Rename",
                    text: "Change the name of the file",
                    type: "input",
                    showCancelButton: true,
                    animation: "slide-from-top",
                    inputPlaceholder: "New name"
                }, function ( inputValue ) {
                    if ( inputValue === false )
                        return false;
                    if ( inputValue === "" ) {
                        swal.showInputError( "You need to write something!" );
                        return false
                    } 
                    swal( "Nice!", "You wrote: " + inputValue, "success" );
                    // fs.rename(oldPath, newPath, callback);
                });
            },
            open: ( e ) => {
                e.preventDefault( );
                if ( file ) {
                    shell.openItem(Path.join( path, file ));
                    return;
                }
                shell.showItemInFolder( path );
            },
            preview: ( e ) => {
                e.preventDefault( );
                self.setState({
                    previewModalIsOpen: !self.state.previewModalIsOpen
                });
            },
            moveLeft: ( e ) => {
                e.preventDefault( );
                console.log( "Move left" );
                console.log( "Path", path );
                console.log("New path", Path.join( path, '..' ));
                if ( path === '' || path === '/' ) {
                    return;
                }
                if ( file ) {
                    self._selectPath( path );
                    return;
                }
                self._selectPath(Path.join( path, '..' ));
            },
            moveRight: ( e ) => {
                e.preventDefault( );
                console.log( "Move right" );
                if ( file ) {
                    shell.openItem(Path.join( path, file ));
                    return;
                }
            },
            moveDown: ( e ) => {
                e.preventDefault( );
                console.log( "Move down" );
            },
            moveUp: ( e ) => {
                e.preventDefault( );
                console.log( "Move up" );
            }
        };
    }
}
