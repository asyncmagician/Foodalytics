import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-file-selector',
  templateUrl: './file-selector.component.html',
  styleUrls: ['./file-selector.component.scss'],
})
export class FileSelectorComponent implements OnChanges {
  @Input()
  nonSelectedFileText: string = 'Aucun fichier selectionné';

  @Input()
  src: string | null = null;

  @Output()
  changeFile: EventEmitter<File | null> = new EventEmitter();

  selectedFile: File | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  onFileChange(event: any) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.src = e.target.result;
    };

    reader.readAsDataURL(event.target.files[0]);
    this.selectedFile = event.target.files[0];

    this.changeFile.emit(this.selectedFile);
  }
}
