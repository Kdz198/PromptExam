package hoangtugio.org.promptexam.Util;

import hoangtugio.org.promptexam.Service.SequenceGeneratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.mapping.event.AbstractMongoEventListener;
import org.springframework.data.mongodb.core.mapping.event.BeforeConvertEvent;
import org.springframework.stereotype.Component;

import java.lang.reflect.Field;

@Component
public class ModelListener extends AbstractMongoEventListener<Object> {

    private final SequenceGeneratorService sequenceGeneratorService;

    @Autowired
    public ModelListener(SequenceGeneratorService sequenceGeneratorService) {
        this.sequenceGeneratorService = sequenceGeneratorService;
    }

    @Override
    public void onBeforeConvert(BeforeConvertEvent<Object> event) {
        Object source = event.getSource();
        if (source == null) return;
        try {
            Field idField = null;
            // find a field named "id" of type int
            for (Field f : source.getClass().getDeclaredFields()) {
                if ("id".equals(f.getName()) && (f.getType().equals(int.class) || f.getType().equals(Integer.class))) {
                    idField = f;
                    break;
                }
            }
            if (idField != null) {
                idField.setAccessible(true);
                Object val = idField.get(source);
                int intVal = 0;
                if (val != null) {
                    intVal = (Integer) val;
                }
                if (intVal == 0) {
                    // use collection name as sequence key
                    String seqName = source.getClass().getSimpleName().toLowerCase();
                    int seq = sequenceGeneratorService.generateSequence(seqName + "_seq");
                    idField.set(source, seq);
                }
            }
        } catch (IllegalAccessException ignored) {
        }
    }
}

