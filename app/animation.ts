import { style, animate, transition, state, trigger } from '@angular/core';


export class Animations {

    static page = [
        trigger('routeAnimation', [
            state('*', style({ opacity: 1 })),
            transition('void => *', [
                style({ opacity: 0.5 }),
                animate('300ms')

            ]),
            transition('* => void', [
                style({ opacity: 1 }),
                animate('300ms')
            ]),
        ])
    ];

    static bigVal = [
        trigger('visibilityChanged', [
            state('shown', style({ opacity: 1 })),
            state('hidden', style({ opacity: 0 })),
            transition('shown => hidden', animate('600ms')),
            transition('hidden => shown', animate('700ms')),
        ])
    ]
}
