/**
 * Demo application.
 */


"use strict";

// use "IIFE" so none of our variables "leak" into the global namespace
( function () {
    var module

    /**
     * Define the overal structure, and some initial content for our model(s).
     */
    var model_init = function () {

        // initialize some data in our model
        return {

            /** number of tickets option list */
            ticket_opts: R.range( 0, 11 ),

            /** metadata for page header/footer */
            meta: {

                /** copyright year */
                cr_yr: 2016,

                /** how is the company branded *this* year? */
                corp_alias: 'AcmeCorp',
            },

            /** message list */
            msgs: [],

            /** raffle winner */
            winner: {},  // see below

            /** form entry buffer */
            entry: {},  // see below

            /** list of participants / contestants (to be loaded from server) */
            entrants: [],

        }
    }

    /**
     * Return the controller's event handlers and other supporting functions/objects.
     * @param mod - value object containing model(s) for the view.
     * @param $window - Angular wrapper service around JS window global
     * @param $timeout - Angular wrapper service around JS window.setTimeout
     *      (which triggers view update)
     */
    var controller_init = function ( mod, $window, $timeout ) {

        /** clear message list */
        var clear_msgs = function () {
            mod.msgs = []
        }

        /** add a message to show */
        var add_msg = function ( msg ) {
            mod.msgs.push( msg )
        }

        /** run the raffle, randomly select a winner */
        var run_raffle = function () {
            var basket

            /**
             * Expand an entrant's entry N times, based upon number of tickets.
             * @param entrant - the raffle entrant record
             */
            var expander = function ( entrant ) {
                return R.map( ( ignore ) =>
                    entrant
                )(
                    R.range( 0, entrant.tickets )
                )
            }

            /**
             * Return a random integer between 0 to N-1
             * @param limit - the N which the result must be less than
             */
            var bounded_rand_whole = function ( limit ) {
                return Math.floor(
                    Math.random() * limit
                )
            }

            clear_msgs()
            add_msg( 'Selecting raffle winner...' )
            mod.winner = ''

            // basket of entries - N tickets per entrant
            basket = R.flatten( R.map( expander, mod.entrants ) )
            add_msg( 'Sifting through ' + basket.length + ' tickets...' )

            // pretend this takes time...
            $timeout(
                function () {
                    clear_msgs()
                    add_msg( 'We have a winner!' )
                    mod.winner = basket[
                        bounded_rand_whole( basket.length )
                    ]
                },
                3000
            )
        }

        /**
         * select the indicated row
         * @param $index {Number} - 0 based row index
         */
        var sel_row = function ( $index ) {
            mod.entry = mod.entrants[ $index ]  // alias
        }

        /**
         * Return the style-object for ng-style depending on row selection.
         * @param $index {Number} - 0 based row index
         */
        var get_row_style = function ( $index ) {
            return ( mod.entry === mod.entrants[ $index ] ) ?
                {
                    'font-size': '1.25em',
                    'font-weight': 'bold',
                } : {}
        }

        /** delete the currently selected participant row */
        var del = function () {
            mod.entrants = R.filter( ( entrant ) =>
                ( mod.entry !== entrant )  // skip the one that was in the form
            )( mod.entrants )
            mod.entry = {}
        }

        /** add a new entry in the participant table and edit it */
        var add = function () {
            mod.entrants.push( {} )
            mod.entry = mod.entrants[
                mod.entrants.length - 1
            ]
            $window.document.getElementById(
                'fname'
            ).focus()
        }

        // export controller methods (functions)
        return {
            clear_msgs,
            add_msg,
            run_raffle,
            sel_row,
            get_row_style,
            del,
            add,
        }
    }

    /**
     * Initialize application specific resources (model, controller)
     *  on the container object provided by Angular.
     * @constructor
     * @param $window - Angular wrapper service around JS window global
     * @param $timeout - Angular wrapper service around JS window.setTimeout
     *      (which triggers view update)
     * @param $http - Angular wrapper around XMLHttpRequest (xhr) access.
     */
    var scope_init = function ( $window, $timeout, $http ) {
        var $scope = this  // a convenient alias

        // initialize some data in our model
        $scope.mod = model_init()

        // initial controller event handlers and such
        $scope.ctl = controller_init( $scope.mod, $window, $timeout )

        // other one-time setup here...
        ; ( function () {

            /** process content of successful REST request */
            var happy_handler = function ( resp ) {
                $scope.mod.entrants = resp.data.entrants
            }

            /** deal with errors */
            var fail_handler = function ( resp ) {
                $scope.ctl.add_msg(
                    'Remote data access error: ' + resp.status +
                    ': ' + resp.statusText
                )
            }

            $http.get(
                'entrants.json'  // or other URI
            ).then(
                happy_handler,
                fail_handler
                // "finally" analog here, if any
            )
        } )()
    }

    // now that we have some code defined (out-of-line), let's start up Angular with it.
    module = angular.module( 'demo', [ ] )
    module.controller( 'demoCtrl', scope_init )
} )()


// EOF
