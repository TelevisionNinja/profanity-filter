# profanity-filter

A profanity filter that handles character variations. It builds a regex using a list of blacklisted strings and a character mapping. A whitelist regex is used to remove and then add back in whitelisted strings. This filter encounters the Scunthorpe problem which can be mitigated by the whitelist.

## Examples:
```bash
test: @ss       censored string: ***
test: $h1+      censored string: ****
test: fuck      censored string: ****
test: ffuucckk  censored string: ********
test: a s s     censored string: *****
test: a z z     censored string: *****
test: @ s s     censored string: *****
test: * s s     censored string: *****
test: * z z     censored string: *****
test: as s      censored string: ****
test: az s      censored string: ****
test: a ss      censored string: ****
test: a-ss      censored string: ****
test: a-s-s     censored string: *****
test: a ss word         censored string: **** word  
test: as s word         censored string: **** word  
test: as $ word         censored string: **** word  
test: assass    censored string: ******
test: assassass         censored string: *********  
test: assasass  censored string: ***as***
test: assasassas        censored string: ***as***as 
test: assa$assas        censored string: ***a$***as 
test: assa$zassas       censored string: *********as
test: assa$as   censored string: ***a$as
test: assa$zas  censored string: ******as
test: assasswww         censored string: ******www  
test: f-word    censored string: ******
test: f word    censored string: ******
test: bitch     censored string: *****
test: bitkh     censored string: *****
test: b1tch     censored string: *****
test: batch     censored string: batch
test: b*tch     censored string: *****
test: b*tkh     censored string: *****
test: batch b*tch       censored string: batch *****
test: stop being ab itch        censored string: stop being a******
test: stopbeingabitch   censored string: stopbeinga*****
test: stopbeingab itch  censored string: stopbeinga******
test: your assis trash  censored string: your ***is trash
test: as suspected      true outcome: false     tested outcome: true    censored string: ****uspected
test: polish it         true outcome: false     tested outcome: true    censored string: poli*****
test: sh ithead         censored string: *****head
test: slab itch         true outcome: false     tested outcome: true    censored string: sla******
test: stab itch         true outcome: false     tested outcome: true    censored string: sta******
test: dab itch  true outcome: false     tested outcome: true    censored string: da******
test: pleb itch         true outcome: false     tested outcome: true    censored string: ple******
test: fib itch  true outcome: false     tested outcome: true    censored string: fi******
test: slob itch         true outcome: false     tested outcome: true    censored string: slo******
test: dub itch  true outcome: false     tested outcome: true    censored string: du******
test: ab itch   censored string: a******
test: compass   true outcome: false     tested outcome: true    censored string: comp***
test: bass      true outcome: false     tested outcome: true    censored string: b***
test: assassinate       true outcome: false     tested outcome: true    censored string: ******inate
test: assassin  true outcome: false     tested outcome: true    censored string: ******in
test: assessment        true outcome: false     tested outcome: true    censored string: ***essment
test: assemble  true outcome: false     tested outcome: true    censored string: ***emble
test: assume    true outcome: false     tested outcome: true    censored string: ***ume
test: a$$emble  censored string: ***emble
test: comp@ss   censored string: comp***
test: dam n     censored string: *****
test: dam nobody        true outcome: false     tested outcome: true    censored string: *****obody
test: adam nice         true outcome: false     tested outcome: true    censored string: a*****ice
test: pen is    censored string: ******
test: the pen is red    true outcome: false     tested outcome: true    censored string: the ****** red
test: pen island        true outcome: false     tested outcome: true    censored string: ******land
test: open island       true outcome: false     tested outcome: true    censored string: o******land
test: dampen island     true outcome: false     tested outcome: true    censored string: dam******land
test: happen island     true outcome: false     tested outcome: true    censored string: ha*******land
test: happen issue      true outcome: false     tested outcome: true    censored string: ha********ue
test: happen isolate    true outcome: false     tested outcome: true    censored string: ha*******olate
test: happen isotope    true outcome: false     tested outcome: true    censored string: ha*******otope
test: scunthorpe        censored string: scunthorpe
test: nigeria   censored string: nigeria
test: penistone         censored string: penistone
test: fuck penistone fuck       censored string: **** penistone ****
test: fuck penistone fuck penistone nigeria scunthorpe  censored string: **** penistone **** penistone nigeria scunthorpe
```
